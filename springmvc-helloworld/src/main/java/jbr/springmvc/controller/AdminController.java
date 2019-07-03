package jbr.springmvc.controller;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.apache.commons.collections.map.MultiValueMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.databind.ObjectMapper;

import jbr.springmvc.dao.HackathonDao;
import jbr.springmvc.dao.HackathonRegistrationDao;
import jbr.springmvc.dao.JudgeDao;
import jbr.springmvc.dao.ParticipantResultEntity;
import jbr.springmvc.dao.TeamMembersDao;
import jbr.springmvc.model.HackathonEntity;
import jbr.springmvc.model.HackathonRegistrationEntity;
import jbr.springmvc.model.UserEntity;

@CrossOrigin(origins = "*", maxAge = 3600)
@Controller
@RequestMapping("/admin")
public class AdminController {
	
	@PersistenceContext
	private EntityManager manager;
	
	@Autowired
	public HackathonDao hackathonDao;
	
	@Autowired
	public HackathonRegistrationDao hackathonregistrationdao;
	
	@Autowired
	public JudgeDao judgeDao;
	
	@Autowired
	public TeamMembersDao teamMembersDao;
	
	
	public String instanceName = "ec2-18-219-145-108.us-east-2.compute.amazonaws.com";
	
	
	@RequestMapping(value="/open", method = RequestMethod.POST)
	@ResponseBody
	@Transactional
	public ResponseEntity<String> openHackathon(@RequestBody MultiValueMap clientParams) throws Exception{
		
		
		/*Parsing request params*/
		System.out.println(clientParams);
		String hackathon_id =((ArrayList) clientParams.get("hackathon_id")).get(0).toString();	
		
		//System.out.println("Date: " + start_date);

		Date open_date = new SimpleDateFormat("yyyy-MM-dd").parse(((ArrayList) clientParams.get("open_date")).get(0).toString());
		
		boolean isStartDateChanged = Boolean.parseBoolean(((ArrayList) clientParams.get("isStartDateChanged")).get(0).toString());
		
		
		HackathonEntity hackathon = hackathonDao.getHackathon(hackathon_id);
		hackathon.setOpen_date(open_date);
		if(isStartDateChanged == true) {
			Date start_date = new SimpleDateFormat("yyyy-MM-dd").parse(((ArrayList) clientParams.get("start_date")).get(0).toString());
			hackathon.setStart_date(start_date);
		}
	
		
		hackathonDao.addHackathon(hackathon);
		
		
		return new ResponseEntity<String>(HttpStatus.OK);
	}
	
	@RequestMapping(value="/close",method = RequestMethod.POST)
	@ResponseBody
	@Transactional
	public ResponseEntity<String> closeHackathon(@RequestBody MultiValueMap clientParams) throws Exception{
		
		
		System.out.println("In close");
		/*Parsing request params*/
		String hackathon_id =((ArrayList) clientParams.get("hackathon_id")).get(0).toString();	
		
		//System.out.println("Date: " + start_date);

		Date close_date = new SimpleDateFormat("yyyy-MM-dd").parse(((ArrayList) clientParams.get("close_date")).get(0).toString());
		
		HackathonEntity hackathon = hackathonDao.getHackathon(hackathon_id);
		hackathon.setClose_date(close_date);;
		hackathonDao.addHackathon(hackathon);
		
		
		return new ResponseEntity<String>(HttpStatus.OK);
	}
	
	@RequestMapping(value="/finalize",method = RequestMethod.POST)
	@ResponseBody
	@Transactional
	public ResponseEntity<String> finalizeHackathon(@RequestBody MultiValueMap clientParams) throws Exception{
		
		
		System.out.println("In Finalize");
		/*Parsing request params*/
		String hackathon_id =((ArrayList) clientParams.get("hackathon_id")).get(0).toString();	
		
		//System.out.println("Date: " + start_date);

		Date finalize_date = new SimpleDateFormat("yyyy-MM-dd").parse(((ArrayList) clientParams.get("finalize_date")).get(0).toString());
		
		HackathonEntity hackathon = hackathonDao.getHackathon(hackathon_id);
		hackathon.setFinalize_date(finalize_date);
		hackathonDao.addHackathon(hackathon);
		
		
		
		
		
		
		
		
		return new ResponseEntity<String>(HttpStatus.OK);
	}
	
	
	@RequestMapping(value="/send-leaderboard-emails",method = RequestMethod.POST)
	@ResponseBody
	@Transactional
	public ResponseEntity<String> sendLeaderBoardEmails(@RequestBody MultiValueMap clientParams) throws Exception{
		
		
		String hackathon_id =((ArrayList) clientParams.get("hackathon_id")).get(0).toString();
		/*Send LeaderBoard Email*/
		
		//Get judge emails 
		
		List<String> judgeEmails = judgeDao.getJudgeEmails(new Integer(hackathon_id));
		
		EmailController emailController = new EmailController();
		
		//send email to judge
		for(int i=0;i<judgeEmails.size();i++) {
			
			String toEmail = judgeEmails.get(i);
			String subject = "Hackathon Results are out!";
			String text = "Greetings from Openhack, \n The results for the hackathon are out ! Click on the link to access the leaderboard. " + "http://"+instanceName+":3000/hackathon-scoreboard/" + hackathon_id;
			
			emailController.sendEmail(toEmail, subject, text);
		}
		
		//get team-member emails
		
		List<UserEntity> hackathonParticipantEmails = hackathonDao.getHackathonParticipantEmails(new Integer(hackathon_id));
		
		//
		List<UserEntity> hackathonWinners = teamMembersDao.getHackathonWinners(new Integer(hackathon_id));
		
		System.out.println("hackwn" +hackathonWinners.size() );
		System.out.println("hack" +hackathonParticipantEmails.size() );
		
		for(int i=0;i<hackathonWinners.size();i++) {
			
			if(hackathonParticipantEmails.indexOf(hackathonWinners.get(i)) != -1) {
				hackathonParticipantEmails.remove(hackathonParticipantEmails.indexOf(hackathonWinners.get(i)));
			}
			
			String toEmail = hackathonWinners.get(i).getEmail(); 
			String subject = "C"
					+ "ongratulations! You're a champion"; 
			String text =
					  "Greetings from Openhack, \n The results for the hackathon are out ! Hearty congratualations from Openhack for winning the hackathon!"
					  + "Click on the link to access the leaderboard. "
					  + "http://"+instanceName+":3000/hackathon-scoreboard/" + hackathon_id;					 
			emailController.sendEmail(toEmail, subject, text);					  
		}
		
		System.out.println("hackwn" +hackathonWinners.size() );
		System.out.println("hack" +hackathonParticipantEmails.size() );
		
		
		  for(int i=0;i<hackathonParticipantEmails.size();i++) { String toEmail =
		  hackathonParticipantEmails.get(i).getEmail(); String subject =
		  "Hackathon Results are out!"; String text =
		  "Greetings from Openhack, \\n The results for the hackathon are out ! Click on the link to access the leaderboard."
		  +"http://"+instanceName+":3000/hackathon-scoreboard/" + hackathon_id;
		  
		  emailController.sendEmail(toEmail, subject, text); }
		 
		
		
		
	
		
		
		return new ResponseEntity<String>(HttpStatus.OK);
		
	}
	
	@RequestMapping(value="/isHackathonGraded",method = RequestMethod.GET)
	@ResponseBody
	@Transactional
	public ResponseEntity<String> isHackathonGraded(@RequestParam(value = "hackathonId", required = true) String hackathonId){
		
		int hackathon_id = new Integer(hackathonId);		
		List<HackathonRegistrationEntity> result = hackathonregistrationdao.getNonGradedHackathons(hackathon_id);
		
		if(result.size() > 0)
			return new ResponseEntity<String>("false", HttpStatus.OK);
		else
			return new ResponseEntity<String>("true", HttpStatus.OK);
		
		//return null;
	}
	
	@RequestMapping(value="/isGradedHackathons",method = RequestMethod.GET)
	@ResponseBody
	@Transactional
	public ResponseEntity<String> isGradedHackathons(@RequestParam(value = "hackathonId", required = true) String hackathonId){
		
		int hackathon_id = new Integer(hackathonId);		
		List<HackathonRegistrationEntity> result = hackathonregistrationdao.getGradedHackathons(hackathon_id);
		System.out.println("Graded Hackathons: " + result);
		if(result.size() > 0)
			return new ResponseEntity<String>("true", HttpStatus.OK);
		else
			return new ResponseEntity<String>("false", HttpStatus.OK);
		
		//return null;
	}
	
	@RequestMapping(value="/send-hackathon-invitation",method = RequestMethod.POST)
	@ResponseBody
	@Transactional
	public ResponseEntity<String> sendHackathonInvitation(@RequestBody MultiValueMap clientParams) throws Exception {
		
		String hackathon_id =((ArrayList) clientParams.get("hackathon_id")).get(0).toString();
		String invitee_email =((ArrayList) clientParams.get("invitee_email")).get(0).toString();
		
		EmailController emailController = new EmailController();
		
		String toEmail = invitee_email; 
		String subject = "Hackathon Invitation From OpenHack"; 
		String text =
				  "Greetings from Openhack, \n You have been invited to a hackathon from Openhack"
				  + "Click on the link to start the registration process. "
				  + "http://"+instanceName+":3000/hackathon/" + hackathon_id;					 
		emailController.sendEmail(toEmail, subject, text);		
		return new ResponseEntity<String>(HttpStatus.OK);
	}

}
