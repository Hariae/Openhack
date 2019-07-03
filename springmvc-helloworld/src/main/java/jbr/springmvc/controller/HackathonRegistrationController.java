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

import jbr.springmvc.HackathonRegistration;
import jbr.springmvc.dao.HackathonRegistrationDao;
import jbr.springmvc.dao.UserDao;
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
@RequestMapping("/hackathonregistration")
public class HackathonRegistrationController {
	
	@Autowired
	public HackathonRegistrationDao hackathonregistrationdao;

	@PersistenceContext
	private EntityManager manager;

	@RequestMapping(value = "/**", method = RequestMethod.OPTIONS)
	public ResponseEntity handle() {
		return new ResponseEntity(HttpStatus.OK);
	}
	
	@RequestMapping(value = "/updatescore", method = RequestMethod.POST)

	@ResponseBody

	@Transactional
	public ResponseEntity<String> updateScore(@RequestBody MultiValueMap formParams)

			throws Exception {
		System.out.println(formParams);
		String team_name = ((ArrayList) formParams.get("team_name")).get(0).toString();
		String score = ((ArrayList) formParams.get("score")).get(0).toString();
		
		HackathonRegistrationEntity hackathonregistration = hackathonregistrationdao.getHackathon(team_name);
		hackathonregistration.setScore(Float.parseFloat(score));
	     hackathonregistrationdao.updateScore(hackathonregistration);
	     
	     return new ResponseEntity(HttpStatus.OK);
}
}
