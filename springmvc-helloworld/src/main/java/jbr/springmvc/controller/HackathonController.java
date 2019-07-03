package jbr.springmvc.controller;

import org.apache.commons.collections.map.AbstractMapDecorator;
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

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import jbr.springmvc.dao.HackathonDao;
import jbr.springmvc.dao.JudgeDao;
import jbr.springmvc.dao.SponsorDao;
import jbr.springmvc.dao.TeamMembersDao;
import jbr.springmvc.dao.UserDao;
import jbr.springmvc.model.HackathonEntity;
import jbr.springmvc.model.HackathonRegistrationEntity;
import jbr.springmvc.model.JudgeEntity;
import jbr.springmvc.model.SponsorEntity;
import jbr.springmvc.model.TeamMemberEntity;
import jbr.springmvc.model.UserEntity;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.format.DateTimeFormatter;
import java.util.*;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

@CrossOrigin(origins = "*", maxAge = 3600)
@Controller
@RequestMapping("/hackathon")
public class HackathonController {
	
	@PersistenceContext
	private EntityManager manager;
	
	@Autowired
	public HackathonDao hackathonDao;
	
	@Autowired
	public JudgeDao judgeDao;
	
	@Autowired
	public SponsorDao sponsorDao;
	
	@Autowired
	public UserDao userDao;
	
	@Autowired
	public TeamMembersDao teamMembersDao;
	
	public String instanceName = "ec2-18-219-145-108.us-east-2.compute.amazonaws.com";
	
	
	@RequestMapping(method = RequestMethod.POST)
	@ResponseBody
	@Transactional
	public ResponseEntity<String> createHackathon(@RequestBody MultiValueMap clientParams) throws Exception{
		
		System.out.println(clientParams);
		HackathonEntity hackathon = new HackathonEntity();
		List judges = (List) ((List) (clientParams.get("judgeList"))).get(0);
		List sponsors = null;
		 if((List)( (List) clientParams.get("sponsorList")).get(0) != null) {
		sponsors = (List) ((List) (clientParams.get("sponsorList"))).get(0);
		}
		/*Parsing request params*/
		String event_name = ((ArrayList) clientParams.get("event_name")).get(0).toString();	
		//System.out.println("Date: " + start_date);
		Date start_date =new SimpleDateFormat("yyyy-MM-dd").parse(((ArrayList) clientParams.get("start_date")).get(0).toString());
		Date end_date =new SimpleDateFormat("yyyy-MM-dd").parse(((ArrayList) clientParams.get("end_date")).get(0).toString());
		//Date open_date = new SimpleDateFormat("yyyy-MM-DD").parse(((ArrayList) clientParams.get("open_date")).get(0).toString());
		//Date close_date = new SimpleDateFormat("yyyy-MM-DD").parse(((ArrayList) clientParams.get("close_date")).get(0).toString());
		String description = ((ArrayList) clientParams.get("description")).get(0).toString();
		
		
		int min_size = Integer.parseInt(((ArrayList) clientParams.get("min_size")).get(0).toString());
		int max_size = Integer.parseInt(((ArrayList) clientParams.get("max_size")).get(0).toString());
		int registration_fee = Integer.parseInt(((ArrayList) clientParams.get("registration_fee")).get(0).toString());
		
		if(((ArrayList)clientParams.get("sponsor_discount")).get(0) != null){
			int sponsor_discount = Integer.parseInt(((ArrayList) clientParams.get("sponsor_discount")).get(0).toString());
			hackathon.setSponsor_discount(sponsor_discount);
		}
		
		/*Parsing request params*/
		
		
		hackathon.setEvent_name(event_name);
		hackathon.setStart_date(start_date);
		hackathon.setEnd_date(end_date);
		//hackathon.setOpen_date(open_date);
		//hackathon.setClose_date(close_date);
		hackathon.setDescription(description);
		
		hackathon.setMin_size(min_size);
		hackathon.setMax_size(max_size);
		hackathon.setRegistration_fee(registration_fee);
		
		int id = hackathonDao.addHackathon(hackathon);
		
		
		
		  
		  for (int i =0; i<judges.size() ; i++) {
		JudgeEntity judge = new JudgeEntity(); judge.setHackathon_id(id);
		  judge.setJudge_id((Integer)judges.get(i));
		   judgeDao.addJudge(judge); }
		 
		  if(sponsors != null) {
		  for (int i =0; i<sponsors.size() ; i++) {
		SponsorEntity sponsor = new SponsorEntity();
		sponsor.setHackathon_id(id);
		  sponsor.setOrganization_id((Integer)sponsors.get(i));
		   sponsorDao.addSponsor(sponsor); }
		  }
		
		return new ResponseEntity<String>(HttpStatus.OK);
	}
	
	@RequestMapping(method = RequestMethod.GET)
	@ResponseBody
	@Transactional
	public ResponseEntity<String> getHackathonById(@RequestParam(value = "id", required = true) String id) throws Exception{
		
		HackathonEntity hackathon = hackathonDao.getHackathon(id);
		
		ObjectMapper obj = new ObjectMapper();
		String result = obj.writeValueAsString(hackathon);
		
		return new ResponseEntity<String>(result, HttpStatus.OK);
	
		
	}
	
	@RequestMapping(value="/get-hackathons", method = RequestMethod.GET)
	@ResponseBody
	@Transactional
	public ResponseEntity<String> getHackathons() throws Exception{
		
		List<HackathonEntity> hackathons = hackathonDao.getHackathons();
		Collections.reverse(hackathons);
		
		ObjectMapper obj = new ObjectMapper();
		String result = obj.writeValueAsString(hackathons);
		
		return new ResponseEntity<String>(result, HttpStatus.OK);
	}
	
	@RequestMapping(value="/gethackathonswherenotjudge", method = RequestMethod.GET)
	@ResponseBody
	@Transactional
	public ResponseEntity<String> getHackathonsWhereNotJudge(@RequestParam(value = "email", required = true) String email) throws Exception{
		UserEntity user = userDao.getUser(email);
		int id = user.getId();
		List<HackathonEntity> hackathons = hackathonDao.getHackathonsWhereNotJudge(id);
		
		Collections.reverse(hackathons);
		
		ObjectMapper obj = new ObjectMapper();
		String result = obj.writeValueAsString(hackathons);
		
		return new ResponseEntity<String>(result, HttpStatus.OK);
	}
	
	@RequestMapping(value="/send-registration-mail", method = RequestMethod.POST)
	@ResponseBody
	@Transactional
	public void sendHackathonRegistrationMail(@RequestBody MultiValueMap clientParams) throws Exception{
		
		
		EmailController emailHandler = new EmailController();
		
		String email =  ((ArrayList) clientParams.get("email")).get(0).toString();	
		String hackathonId = ((ArrayList) clientParams.get("hackathon_id")).get(0).toString();
		String team_id =  ((ArrayList) clientParams.get("team_id")).get(0).toString();	
		String subject = "Openhack - Hackathon Registration";
		String teamMember_id = ((ArrayList) clientParams.get("teamMember_id")).get(0).toString();
		String hackathon_name = ((ArrayList) clientParams.get("hackathon_name")).get(0).toString();
		String hackathon_details = ((ArrayList) clientParams.get("hackathon_details")).get(0).toString();
		String text = "Greetings from Openhack" +  ".\nYou have been added as a team member to a hackathon event. \n"  + "Hackathon Name: " + hackathon_name + ". \n" + "Hackathon Details: " + hackathon_details + ".\n" + 
		"Click the link to proceed to payment page. http://"+instanceName+":3000/hackathon/payment/"+hackathonId + "/" + team_id + "/"+teamMember_id;
		emailHandler.sendEmail(email, subject, text);
	}
	
	@RequestMapping(value="/registration", method = RequestMethod.POST)
	@ResponseBody
	@Transactional
	public ResponseEntity<String> hackathonRegistration(@RequestBody MultiValueMap clientParams) {
		
		String team_name = ((ArrayList) clientParams.get("team_name")).get(0).toString();	
		int hackathon_id = Integer.parseInt(((ArrayList) clientParams.get("hackathon_id")).get(0).toString());
		
		HackathonRegistrationEntity hackathonRegistration = new HackathonRegistrationEntity();
		hackathonRegistration.setHackathon_id(hackathon_id);
		hackathonRegistration.setTeam_name(team_name);
		hackathonRegistration.setApproved(false);
		int hackathonId = hackathonDao.addHackathonRegistration(hackathonRegistration);	
		
		return new ResponseEntity<String>(hackathonId+"", HttpStatus.OK); 
	}
	
	@RequestMapping(value="/team-member", method = RequestMethod.POST)
	@ResponseBody
	@Transactional
	public void addHackathonTeamMember(@RequestBody MultiValueMap clientParams) {
	
		int team_id = Integer.parseInt(((ArrayList) clientParams.get("team_id")).get(0).toString());
		int member_id = Integer.parseInt(((ArrayList) clientParams.get("member_id")).get(0).toString());
		String role = ((ArrayList) clientParams.get("role")).get(0).toString();
		boolean payment = Boolean.parseBoolean(((ArrayList) clientParams.get("payment")).get(0).toString());
		boolean team_lead = Boolean.parseBoolean(((ArrayList) clientParams.get("team_lead")).get(0).toString());
		
		TeamMemberEntity teamMemberEntity = new TeamMemberEntity();
		teamMemberEntity.setTeam_id(team_id);
		teamMemberEntity.setMember_id(member_id);
		teamMemberEntity.setRole(role);
		teamMemberEntity.setPayment(payment);
		teamMemberEntity.setTeam_lead(team_lead);
		
		hackathonDao.addHackathonTeamMember(teamMemberEntity);
	}
	
	@RequestMapping(value="/process-payment", method = RequestMethod.POST)
	@ResponseBody
	@Transactional
	public ResponseEntity<String> processPayment(@RequestBody MultiValueMap clientParams) throws Exception {
		int team_id = Integer.parseInt(((ArrayList) clientParams.get("team_id")).get(0).toString());
		int member_id = Integer.parseInt(((ArrayList) clientParams.get("member_id")).get(0).toString());
		String totalAmount = ((ArrayList) clientParams.get("totalAmount")).get(0).toString();
		//String timestamp = null;
		String time_stamp = ((ArrayList) clientParams.get("time_stamp")).get(0).toString();
		TeamMemberEntity teamMemberEntity = hackathonDao.getTeamMember(team_id, member_id);		
		teamMemberEntity.setPayment(true);
		teamMemberEntity.setAmount_paid(Float.parseFloat(totalAmount));
		teamMemberEntity.setTime_stamp(time_stamp);
		hackathonDao.addHackathonTeamMember(teamMemberEntity);
		
		return new ResponseEntity<String>(HttpStatus.OK);
	}
	
	@RequestMapping(value="/send-payment-invoice", method = RequestMethod.POST)
	@ResponseBody
	@Transactional
	public ResponseEntity<String> sendPaymentInvoiceEmail(@RequestBody MultiValueMap clientParams) throws Exception{
		
		int team_id = Integer.parseInt(((ArrayList) clientParams.get("team_id")).get(0).toString());
		int member_id = Integer.parseInt(((ArrayList) clientParams.get("member_id")).get(0).toString());
		String totalAmount = ((ArrayList) clientParams.get("totalAmount")).get(0).toString();
		
		/*payment invoice*/		
		EmailController emailHandler = new EmailController();
		UserEntity currentUser = userDao.getUserbyId(member_id);
		String toEmail = currentUser.getEmail();		
		String subject = "OpenHack Payment Invoice";
		String text = "Greetings from Openhack. \n Total Amount Paid towards Openhack $" + totalAmount;
		
		
		emailHandler.sendEmail(toEmail, subject, text);
		
				
		/*payment invoice*/
		
		List<TeamMemberEntity> teamMembers = hackathonDao.getTeamMembers(team_id);
		
		//System.out.println(teamMembers);
		boolean isPaymentFlag = true;
		for(int i=0;i<teamMembers.size();i++) {
			if(teamMembers.get(i).isPayment() == false) {
				isPaymentFlag = false;
				break;
			}
			
			//if(teamMember)
		}
		
		if(isPaymentFlag == true) {
			HackathonRegistrationEntity hackathonRegistration = hackathonDao.getHackathonRegistration(team_id);
			hackathonRegistration.setApproved(true);
			hackathonDao.addHackathonRegistration(hackathonRegistration);
			
			UserEntity teamLead = hackathonDao.getTeamLead(team_id);
			
			toEmail = teamLead.getEmail();		
			subject = "OpenHack Payment Process Completed";
			text = "Greetings from Openhack. \nAll your team Members have completed the payment.";
			
			emailHandler.sendEmail(toEmail, subject, text);
		}
		
		
		
		return null;
	}
	
	@RequestMapping(value="/add-submission", method = RequestMethod.POST)
	@ResponseBody
	@Transactional
	public void addSubmission(@RequestBody MultiValueMap clientParams) {
	
		int team_id = Integer.parseInt(((ArrayList) clientParams.get("team_id")).get(0).toString());
		String submission_url = ((ArrayList) clientParams.get("submission_url")).get(0).toString();
		System.out.println("teamid " + team_id);
		HackathonRegistrationEntity hackathonRegistration = hackathonDao.getHackathonRegistration(team_id);
		
		hackathonRegistration.setSubmission_url(submission_url);
		hackathonDao.addHackathonRegistration(hackathonRegistration);	 
	}
	
	@RequestMapping(value="/get-registered-hackathons", method = RequestMethod.GET)
	@ResponseBody
	@Transactional
	public ResponseEntity<String> getRegisteredHackathons(@RequestParam(value = "email", required = true) String email) throws Exception{
		
		
		UserEntity user = userDao.getUser(email);
		int member_id = user.getId();
		
		//int member_id = Integer.parseInt(((ArrayList) clientParams.get("member_id")).get(0).toString());
		System.out.println(member_id);
		
		List<HackathonRegistrationEntity> registeredHackathons = hackathonDao.getRegisteredHackathons(member_id);
		System.out.println("reg" + registeredHackathons);
		ObjectMapper obj = new ObjectMapper();
		String result = obj.writeValueAsString(registeredHackathons);
		
		return new ResponseEntity<String>(result, HttpStatus.OK);
	}
	
	@RequestMapping(value="/get-hackathon-registration", method = RequestMethod.GET)
	@ResponseBody
	@Transactional	
	public ResponseEntity<String> getHackathonRegistration(@RequestParam(value = "team_id", required = true) String team_id) throws Exception{
				
		int teamId = Integer.parseInt(team_id);
		HackathonRegistrationEntity hackathonRegistration = hackathonDao.getHackathonRegistration(teamId);
		ObjectMapper obj = new ObjectMapper();
		String result = obj.writeValueAsString(hackathonRegistration);		
		return new ResponseEntity<String>(result, HttpStatus.OK);		
	}
	
	@RequestMapping(value="/get-sponsors", method = RequestMethod.GET)
	@ResponseBody
	@Transactional		
	public ResponseEntity<String> getSponsors(@RequestParam(value = "hackathon_id", required = true) String hackathonId, @RequestParam(value = "organization_id", required = true) String organizationId) throws Exception{
		
		int hackathon_id = Integer.parseInt(hackathonId);
		int organization_id = Integer.parseInt(organizationId);
		List<SponsorEntity> sponsors = sponsorDao.getSponsors(hackathon_id, organization_id);				
		ObjectMapper obj = new ObjectMapper();
		String result = obj.writeValueAsString(sponsors);			
		return new ResponseEntity<String>(result, HttpStatus.OK);
		
	}
	
	
	@RequestMapping(value="/get-finalized-hackathons", method = RequestMethod.GET)
	@ResponseBody
	@Transactional
	public ResponseEntity<String> getFinalizedHackathons() throws Exception{
		
		List<HackathonEntity> hackathons = hackathonDao.getFinalizedHackathons();
		Collections.reverse(hackathons);
		
		ObjectMapper obj = new ObjectMapper();
		String result = obj.writeValueAsString(hackathons);
		
		return new ResponseEntity<String>(result, HttpStatus.OK);
	}
	
	
	@RequestMapping(value="/get-team-members", method = RequestMethod.GET)
	@ResponseBody
	@Transactional
	public ResponseEntity<String> getTeamMembers(@RequestParam(value = "teamId", required = true) String teamId) throws Exception{
		
		List<String> teamMembers= teamMembersDao.getTeamMembers(new Integer(teamId));
		
		ObjectMapper obj = new ObjectMapper();
		String result = obj.writeValueAsString(teamMembers);
		
		return new ResponseEntity<String>(result, HttpStatus.OK);
	}
	
	@RequestMapping(value="/isTeamNameAvailable", method = RequestMethod.GET)
	@ResponseBody
	@Transactional
	public ResponseEntity<String> isTeamNameAvailable(@RequestParam(value = "teamName", required = true) String teamName) throws Exception{
		
		
		List<HackathonRegistrationEntity> result =  hackathonDao.getTeamsByName(teamName);
		if(result.size() > 0) {
			return new ResponseEntity<String>("false", HttpStatus.OK); 
		}
		else {
			return new ResponseEntity<String>("true", HttpStatus.OK);
		}
		
	}
	
	@RequestMapping(value = "/**", method = RequestMethod.OPTIONS)
	public ResponseEntity handle() {
		return new ResponseEntity(HttpStatus.OK);
	}
	

}
