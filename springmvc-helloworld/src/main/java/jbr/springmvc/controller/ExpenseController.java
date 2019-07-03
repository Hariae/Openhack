package jbr.springmvc.controller;

import java.util.ArrayList;
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

import jbr.springmvc.dao.ExpenseDao;
import jbr.springmvc.dao.HackathonDao;
import jbr.springmvc.model.ExpenseEntity;
import jbr.springmvc.model.HackathonEntity;

@CrossOrigin(origins = "*", maxAge = 3600)
@Controller
@RequestMapping("/expense")
public class ExpenseController {
	
	@PersistenceContext
	private EntityManager manager;
	
	@Autowired
	public ExpenseDao expDao;
	
	@RequestMapping(value = "/**", method = RequestMethod.GET)
	public ResponseEntity handle() {
		return new ResponseEntity(HttpStatus.OK);
	}
	
	@RequestMapping(method = RequestMethod.GET)
	@ResponseBody
	@Transactional
	public ResponseEntity<String> getHackathonById(@RequestParam(value = "id", required = true) String id) throws Exception{
//		HackathonEntity hackathon = hackathonDao.getHackathon(id);
		
//		ObjectMapper obj = new ObjectMapper();
//		String result = obj.writeValueAsString(hackathon);
		System.out.println("inidivual hackathon expenses: " +id);
		List<ExpenseEntity> hackathonExpenses = expDao.getHackathonExpenses(Integer.valueOf(id));
		System.out.println("inidivual hackathon expenses: " +hackathonExpenses);
		ObjectMapper obj = new ObjectMapper();
		String result = obj.writeValueAsString(hackathonExpenses);
		return new ResponseEntity<String>(result, HttpStatus.OK);
	
		
	}
	
	@RequestMapping(value="/add", method = RequestMethod.POST)
	@ResponseBody
	@Transactional
	public ResponseEntity<String> addExpense(@RequestBody MultiValueMap clientParams) throws Exception{
		
		
		String description = ((ArrayList) clientParams.get("description")).get(0).toString();
		String title = ((ArrayList) clientParams.get("title")).get(0).toString();
		String time_stamp = ((ArrayList) clientParams.get("time_stamp")).get(0).toString();
		int hackathon_id= Integer.parseInt(((ArrayList) clientParams.get("hackathon_id")).get(0).toString());
		float amount= Float.parseFloat(((ArrayList) clientParams.get("amount")).get(0).toString());
		
		ExpenseEntity expense = new ExpenseEntity();
		expense.setAmount(amount);
		expense.setDescription(description);
		expense.setHackathon_id(hackathon_id);
		expense.setTime_stamp(time_stamp);
		expense.setTitle(title);
		
		int id = expDao.addExpense(expense);
		
		return new ResponseEntity(HttpStatus.OK);
	}
	}


