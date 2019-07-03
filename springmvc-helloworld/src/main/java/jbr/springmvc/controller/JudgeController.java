package jbr.springmvc.controller;

import org.apache.commons.collections.map.MultiValueMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import jbr.springmvc.dao.JudgeDao;
import jbr.springmvc.dao.UserDao;
import jbr.springmvc.model.HackathonEntity;
import jbr.springmvc.model.HackathonRegistrationEntity;
import jbr.springmvc.model.UserEntity;

import java.sql.SQLIntegrityConstraintViolationException;
import java.util.*;
import java.util.regex.Pattern;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.PersistenceException;

@Controller
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/judge")
public class JudgeController {
	@Autowired
	public JudgeDao judgedao;

	@Autowired
	public UserDao userdao;
	
	@PersistenceContext
	private EntityManager manager;

	@RequestMapping(value = "/**", method = RequestMethod.OPTIONS)
	public ResponseEntity handle() {
		return new ResponseEntity(HttpStatus.OK);
	}
	
	@RequestMapping(value="/viewhackathonstobegraded", method = RequestMethod.GET)
	@ResponseBody
	@Transactional
	public ResponseEntity<String> getHackathonsForGrading(@RequestParam(value = "email", required = true) String email) throws JsonProcessingException{
		
		UserEntity user = userdao.getUser(email);
		int id = user.getId();
		
		List<HackathonEntity> hackathons = judgedao.getHackathonsForGrading(id);
		
		ObjectMapper obj = new ObjectMapper();
		String result = obj.writeValueAsString(hackathons);
		System.out.println("Result: " + result);
		
		return new ResponseEntity<String>(result, HttpStatus.OK);
		
	}
	
	@RequestMapping(value="/viewscoreboardhackathon", method = RequestMethod.GET)
	@ResponseBody
	@Transactional
	public ResponseEntity<String> viewScoreBoard(@RequestParam(value = "email", required = true) String email) throws JsonProcessingException{
		
		UserEntity user = userdao.getUser(email);
		int id = user.getId();
		
		List<HackathonEntity> hackathons = judgedao.viewScoreboardHackathon(id);
		
		ObjectMapper obj = new ObjectMapper();
		String result = obj.writeValueAsString(hackathons);
		System.out.println("Result: " + result);
		
		return new ResponseEntity<String>(result, HttpStatus.OK);
		
	}
	
	@RequestMapping(value="/getTeams",method = RequestMethod.GET)
	@ResponseBody
	@Transactional
	public ResponseEntity<String> getTeamsForGrading(@RequestParam(value = "email", required = true) String email , @RequestParam( value = "hackathon_id", required = true) int hackathon_id ) throws JsonProcessingException{
		
		UserEntity user = userdao.getUser(email);
		int id = user.getId();
		
		List<HackathonRegistrationEntity> hackathons = judgedao.getTeamsForGrading(id, hackathon_id );
		
		ObjectMapper obj = new ObjectMapper();
		String result = obj.writeValueAsString(hackathons);
		System.out.println("Result: " + result);
		
		return new ResponseEntity<String>(result, HttpStatus.OK);
		
	}
	
	@RequestMapping(value="/getTeamScores",method = RequestMethod.GET)
	@ResponseBody
	@Transactional
	public ResponseEntity<String> getTeamScores(@RequestParam(value = "hackathonId") String hackathonId) throws Exception{
		
		List<HackathonRegistrationEntity> teamScores = judgedao.getTeamScores(new Integer(hackathonId));
		
		//Collections.sort(teamScores, teamS)
		//teamScores.sort(Comparator.comparing(HackathonRegistrationEntity :: getScore()));
		
		teamScores.sort(new Comparator<HackathonRegistrationEntity>() {

			public int compare(HackathonRegistrationEntity o1, HackathonRegistrationEntity o2) {
				// TODO Auto-generated method stub
				return Float.compare(o1.getScore(), o2.getScore());
			}
			
		});
		
		Collections.reverse(teamScores);
		
		ObjectMapper obj = new ObjectMapper();
		String result = obj.writeValueAsString(teamScores);
		
		return new ResponseEntity<String>(result, HttpStatus.OK);
	}
	

}