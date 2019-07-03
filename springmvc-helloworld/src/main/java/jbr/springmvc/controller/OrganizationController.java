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
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import jbr.springmvc.dao.OrganizationDao;
import jbr.springmvc.model.OrganizationEntity;
import jbr.springmvc.model.UserEntity;
import jbr.springmvc.dao.UserDao;

@CrossOrigin(origins = "*", maxAge = 3600)
@Controller
@RequestMapping("/organizationCreation")
public class OrganizationController {
	@Autowired
	public OrganizationDao orgDao;
	
	@Autowired
	public UserDao userdao;
	@PersistenceContext
	private EntityManager manager;
	
	@RequestMapping(value = "/**", method = RequestMethod.OPTIONS)
	public ResponseEntity handle() {
		return new ResponseEntity(HttpStatus.OK);
	}

	@SuppressWarnings("unused")
	@RequestMapping(method = RequestMethod.POST)

	@ResponseBody

	@Transactional
	public ResponseEntity<String> insertOrganization(@RequestBody MultiValueMap formParams)
	
	throws Exception {
		
		System.out.println("from organizational manager "+formParams);
		OrganizationEntity organization = new OrganizationEntity();
		
		
		String organization_name = ((ArrayList) formParams.get("organizationName")).get(0).toString();
		
		
		if(((ArrayList) formParams.get("description")).get(0).toString() !=null) {
		String description = ((ArrayList) formParams.get("description")).get(0).toString();
		organization.setDescription(description);
		}
		
		if(((ArrayList) formParams.get("address")).get(0).toString() !=null) {
		String address = ((ArrayList) formParams.get("address")).get(0).toString();
		organization.setAddress(address);
		}
		
		String email = ((ArrayList) formParams.get("email")).get(0).toString();
		int owner = 1;
		int user_id = 0;
		String user_name = "";
		UserEntity user;
		try {
			System.out.println("user details who creates organization:");
			user = userdao.getUser(new String(email));
			System.out.println("user details who creates organization:" + user.getId());
			user_id = user.getId();
			user_name = user.getName();
			if (user == null) {
				throw new UserNotFoundException();
			}
		} catch (Exception e) {
			return new ResponseEntity<String>(HttpStatus.NOT_FOUND);
		}
		organization.setName(organization_name);	
		organization.setOwner(user_id);
		
		orgDao.addOrganization(organization);
		return new ResponseEntity<String>(HttpStatus.OK);
	}

	@RequestMapping(value="/getAllOrganizations", method = RequestMethod.GET)
	@ResponseBody
	@Transactional
	public ResponseEntity<String> getAllOrganizations() throws JsonProcessingException{
		List<OrganizationEntity> users = orgDao.getAllOrganizations();
				
		ObjectMapper obj = new ObjectMapper();
		String result = obj.writeValueAsString(users);
		System.out.println("Result of list of organizations: " + result);
		
		return new ResponseEntity<String>(result, HttpStatus.OK);
	}
	
	@RequestMapping(value="/myOrganization", method = RequestMethod.GET)
	@Transactional
	public @ResponseBody ResponseEntity<String> byParameter (@RequestParam(value = "email", required = true) String email) {
		System.out.println("email id of the user fetching organziations is "+email);
		OrganizationEntity organization;
		try {
			UserEntity user = userdao.getUser(email);
			
			Integer idOfTheOrganizationOwner = user.getId();
			System.out.println("idOfTheOrganizationOwner"+idOfTheOrganizationOwner);
			List<OrganizationEntity> users = orgDao.getAllOrganizations();
			List<OrganizationEntity> usersResult = new ArrayList<OrganizationEntity>();
			ObjectMapper obj = new ObjectMapper();
			String result = obj.writeValueAsString(users);
//			res
			
//			organization = orgDao.getUserOrganization(a);
//			commented
			System.out.println("organizations of the user are:::" + obj.writeValueAsString(users));
			for(int i=0;i<users.size();i++) {
				if(users.get(i).getOwner()==idOfTheOrganizationOwner) {
					System.out.println(users.get(i).getId());
					usersResult.add(users.get(i));
				}
			}
//			comment ends
//			System.out.println("usersResult"+usersResult);
			ObjectMapper obj1 = new ObjectMapper();
			String res = obj1.writeValueAsString(usersResult);
			System.out.println("Result of list of organizations created by user: " + res);
			if (result == null) {
				throw new UserNotFoundException();
			}
			return new ResponseEntity<String>(res, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<String>(HttpStatus.NOT_FOUND);
		}
	}
	
	
	  @RequestMapping(method = RequestMethod.GET)
		@ResponseBody
		@Transactional
		public ResponseEntity<String> getOrganization(@RequestParam(value = "id", required = true) Integer id) throws JsonProcessingException{
						
		  	OrganizationEntity org = orgDao.getOrganization(id);
						
			ObjectMapper obj = new ObjectMapper();
			String result = obj.writeValueAsString(org);
			System.out.println("Result: " + result);
			
			return new ResponseEntity<String>(result, HttpStatus.OK);
		}
	
	
	

	
	

}
