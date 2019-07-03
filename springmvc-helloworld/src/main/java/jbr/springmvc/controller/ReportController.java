package jbr.springmvc.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

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
import jbr.springmvc.dao.TeamMembersDao;
import jbr.springmvc.dao.UserDao;
import jbr.springmvc.model.HackathonRegistrationEntity;
import jbr.springmvc.model.TeamMemberEntity;
import jbr.springmvc.model.UserEntity;

@CrossOrigin(origins = "*", maxAge = 3600)
@Controller
@RequestMapping("/hackathon-payment-report")

public class ReportController {
	@Autowired
	public UserDao userdao;
	
	@Autowired
	public HackathonRegistrationDao regdao;

	@Autowired
	public TeamMembersDao teamdao;

	@PersistenceContext
	private EntityManager manager;
	
	@RequestMapping(value = "/**", method = RequestMethod.GET)
	public ResponseEntity handle() {
		return new ResponseEntity(HttpStatus.OK);
	}

	@RequestMapping(method = RequestMethod.GET)

	@ResponseBody

	@Transactional
	public ResponseEntity<String> getHackathons(@RequestParam(value = "id", required = true) String id)

			throws Exception {
		
		List<List<String>> teams=new ArrayList<List<String>>() ;
		List<HackathonRegistrationEntity> allRegistrations =regdao.getAllRegistrations(Integer.parseInt(id));
		
		for(HackathonRegistrationEntity e: allRegistrations) {
			//System.out.println(e);
			List<String> teamDetails = new ArrayList<String>();
			teamDetails.add(e.getTeam_name());
			teamDetails.add(String.valueOf(e.getHackathonRegistrationId()));
			teamDetails.add(String.valueOf(e.isApproved()));
			
			teams.add(teamDetails);
			}
		
		ObjectMapper obj = new ObjectMapper();
		String result = obj.writeValueAsString(teams);
		//System.out.println(result);
		
		return new ResponseEntity<String>( result, HttpStatus.OK);
		
		
	}
	
	@RequestMapping(value="/team",method = RequestMethod.GET)

	@ResponseBody

	@Transactional
	public ResponseEntity<String> getTeamDetails(@RequestParam(value = "team_id", required = true) String team_id, @RequestParam(value = "hackathon_id", required = true) String hackathon_id)

			throws Exception {
		
		List<List<String>> result=new ArrayList<List<String>>() ;
		
		//List<HackathonRegistrationEntity> allRegistrations =regdao.getAllRegistrations(Integer.parseInt(hackathon_id));
		
			List<TeamMemberEntity> members= teamdao.getTeams(Integer.parseInt(team_id));
			
			for(TeamMemberEntity m: members) {
			
			UserEntity userDetails=userdao.getUserbyId(m.getMember_id());
			
			List<String> teamDetails = new ArrayList<String>();
			teamDetails.add(String.valueOf(m.getMember_id()));
			teamDetails.add(userDetails.getScreen_name());
			teamDetails.add(String.valueOf(m.isPayment()));
			teamDetails.add(String.valueOf(m.getTime_stamp()));
			teamDetails.add(String.valueOf(m.getAmount_paid()));
			//amount
			//date
			result.add(teamDetails);
		
		}
			ObjectMapper obj = new ObjectMapper();
			String res = obj.writeValueAsString(result);
			//System.out.println(result);
			
			return new ResponseEntity<String>( res, HttpStatus.OK);

	}
	
	
	}

	
