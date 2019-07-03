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
import jbr.springmvc.dao.UserDao;

import jbr.springmvc.model.UserEntity;

import java.sql.SQLIntegrityConstraintViolationException;
import java.util.*;
import java.util.regex.Pattern;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.PersistenceException;

@Controller
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/user")
public class UserController {
	@Autowired
	public UserDao userdao;

	@PersistenceContext
	private EntityManager manager;
	
	public String instanceName = "ec2-18-219-145-108.us-east-2.compute.amazonaws.com";

	@RequestMapping(value = "/**", method = RequestMethod.OPTIONS)
	public ResponseEntity handle() {
		return new ResponseEntity(HttpStatus.OK);
	}

	@RequestMapping(value = "/signup", method = RequestMethod.POST)

	@ResponseBody

	@Transactional
	public ResponseEntity<String> insertUser(@RequestBody MultiValueMap formParams)

			throws Exception {
		System.out.println(formParams);
		String email = ((ArrayList) formParams.get("email")).get(0).toString();
		String password = ((ArrayList) formParams.get("password")).get(0).toString();
		String screen_name = ((ArrayList) formParams.get("screen_name")).get(0).toString();
	
		String emailRegex = "^[a-zA-Z0-9_+&*-]+(?:\\." + "[a-zA-Z0-9_+&*-]+)*@" + "(?:[a-zA-Z0-9-]+\\.)+[a-z"
				+ "A-Z]{2,7}$";

		Pattern pat = Pattern.compile(emailRegex);
		String[] list = null;
		if (pat.matcher(email).matches()) {
			list = email.split("@");
		}
		UserEntity user1;
		/* email validation */
		try {
			user1 = userdao.getUser(email);
			if (user1 != null) {
				throw new UserAlreadyExists();
			}
		} catch (Exception e) {
			return new ResponseEntity<String>(HttpStatus.BAD_REQUEST);
		}
		
		try {
			user1 = userdao.getUserByScreenName(screen_name);
			if (user1 != null) {
				throw new ScreenNameAlreadyExists();
			}
		} catch (Exception e) {
			return new ResponseEntity<String>(HttpStatus.PRECONDITION_FAILED);
		}
		
		
		/* User Info */
		UserEntity user = new UserEntity();

		user.setEmail(email);
		/* Password */
		user.setPassword(password);
		/* Screen_name */
		user.setScreenName(screen_name);
		if (list[1].equals("sjsu.edu")) {
			user.setRole(true);
		} else
			user.setRole(false);
		
		user.setVerified(false);
		userdao.addUser(user);
		
		UserEntity u=userdao.getUser(email);
		Integer id= u.getId();
		String text = "Click the link to verify your account: http://"+instanceName + ":3000/verify-account/"+id;
		
		//email
		try {
			EmailController em= new EmailController();
			em.sendEmail(email, "Verify your OpenHack Account", text);
			
		}catch(Exception e) {
			return new ResponseEntity<String>(HttpStatus.UNAUTHORIZED);
		}
		
		
		return new ResponseEntity<String>(HttpStatus.OK);
	}

	@RequestMapping(value="/process-verification", method = RequestMethod.POST)
	@ResponseBody
	@Transactional
	public ResponseEntity<String> openHackathon(@RequestBody MultiValueMap clientParams) throws Exception{
		
		
		/*Parsing request params*/
		int user_id = Integer.parseInt(((ArrayList) clientParams.get("user_id")).get(0).toString());
		
		
		UserEntity user = userdao.getUserbyId(user_id);
		user.setVerified(true);
		userdao.addUser(user);
		EmailController em1= new EmailController();
		String email=user.getEmail();
		em1.sendEmail(email, "Welcome to OpenHack!", "Thank you for registering with OpenHack, you can now participate in hackathons, "
				+ "form teams and even be a part of an organization!");
		
		
		
		return new ResponseEntity<String>(HttpStatus.OK);
	}
	
	  @RequestMapping(value = "/login", method = RequestMethod.POST)
	  
	  @ResponseBody
	  
	  @Transactional 
	  public ResponseEntity<String> getUser(@RequestBody MultiValueMap formParams)
	  
	  throws Exception { 
		  System.out.println(formParams); 
		  String email =((ArrayList) formParams.get("email")).get(0).toString(); 
		  String password = ((ArrayList) formParams.get("password")).get(0).toString();
		  
		  //System.out.println("email" + email);
	
		  UserEntity user;
		  user = userdao.getUser(new String(email));
			try {
				user = userdao.getUser(new String(email));
				System.out.println("user:" + user);
				

				if (user == null) {
					throw new UserNotFoundException();
				}
			} catch (Exception e) {
				return new ResponseEntity<String>(HttpStatus.NOT_FOUND);
			}
			
			try {
				if (!password.equals(user.getPassword())){
					throw new UserNotFoundException();	
				}
			}
				catch (Exception e) {
					return new ResponseEntity<String>(HttpStatus.UNAUTHORIZED);
				}
			
			
			try {
				user = userdao.getUser(new String(email));
			
			  Boolean verified= user.getVerified(); System.out.println(verified);
			  
			  if (verified==false){ throw new UserNotVerifiedException(); }
			 
			}
				catch (Exception e) {
					return new ResponseEntity<String>(HttpStatus.UNAUTHORIZED);
				}
			
			
			/* Is Exist */
		  
			user = userdao.getUser(new String(email));
			ObjectMapper obj = new ObjectMapper();
			String result = obj.writeValueAsString(user);
			return new ResponseEntity<String>(result, HttpStatus.OK);
				
			}

	  
	  @RequestMapping(value = "/profile", method = RequestMethod.POST)
	  
	  @ResponseBody
	  @Transactional 
	  public void updateProfile(@RequestBody MultiValueMap formParams) throws Exception
	  {
		  String email =((ArrayList) formParams.get("email")).get(0).toString();
		  UserEntity user = userdao.getUser(new String(email));
		
		  System.out.println(formParams); 
		  if(((ArrayList) formParams.get("name")).get(0) != null) {
			  String name =((ArrayList) formParams.get("name")).get(0).toString();
			  user.setName(name);
		  }
		   
		  if(((ArrayList) formParams.get("portraiturl")).get(0) != null) {
			  String portraiturl = ((ArrayList) formParams.get("portraiturl")).get(0).toString();
			  user.setPortraitURL(portraiturl);
		  }
		  
		  if(((ArrayList) formParams.get("title")).get(0) != null) {
			  String title = ((ArrayList) formParams.get("title")).get(0).toString();
			  user.setBusinessTitle(title);
		  }
		  
		  if(((ArrayList) formParams.get("aboutme")).get(0) != null) {
			  String about_me = ((ArrayList) formParams.get("aboutme")).get(0).toString();
			  user.setAboutMe(about_me);
				 
		  }
		  
		  if(((ArrayList) formParams.get("address")).get(0) != null) {
			  String address = ((ArrayList) formParams.get("address")).get(0).toString();
			  user.setAddress(address);
			 
		  }		   
		  
		  //String organization =
		    userdao.updateUser(user);
		  
		/*
		 * user.setName(name); user.setPortraitURL(portraiturl);
		 * user.setBusinessTitle(title); user.setAboutMe(about_me);
		 * user.setAddress(address);
		 */   userdao.updateUser(user); 	  
	  }
	  
	  @RequestMapping(value = "/leaveOrganization", method = RequestMethod.POST)
	  
	  @ResponseBody
	  
	  @Transactional 
	  public void leaveOrganization(@RequestBody MultiValueMap formParams) throws Exception
	  {
		  System.out.println(formParams); 
		  String email =((ArrayList) formParams.get("email")).get(0).toString(); 
		  UserEntity user = userdao.getUser(new String(email));
//		  change from org to org_id
		  user.setOrganization_id(null);
//		  user.setOrganization_id(0);
//		  change ends
		   userdao.updateUser(user); 	  
		  
		   
	  }
	  
	  @RequestMapping(method = RequestMethod.GET)
		@ResponseBody
		@Transactional
		public ResponseEntity<String> getUser(@RequestParam(value = "email", required = true) String email) throws JsonProcessingException{
			
			
			//String email = ((ArrayList) formParams.get("email")).get(0).toString();
			
		  	UserEntity user = userdao.getUser(email);
						
			ObjectMapper obj = new ObjectMapper();
			String result = obj.writeValueAsString(user);
			System.out.println("Result: " + result);
			
			return new ResponseEntity<String>(result, HttpStatus.OK);
		}
		
		@RequestMapping(value="/getAllUsers", method = RequestMethod.GET)
		@ResponseBody
		@Transactional
		public ResponseEntity<String> getAllUsers() throws JsonProcessingException{
			
			
			//String email = ((ArrayList) formParams.get("email")).get(0).toString();
			
			//get all users
			List<UserEntity> users = userdao.getAllUsers();
					
			ObjectMapper obj = new ObjectMapper();
			String result = obj.writeValueAsString(users);
			System.out.println("Result: " + result);
			
			return new ResponseEntity<String>(result, HttpStatus.OK);
		}


		@RequestMapping(value="/getUsers", method = RequestMethod.GET)
		@ResponseBody
		@Transactional
		public ResponseEntity<String> getAllUsers(@RequestParam(value = "id", required = true) int hackathon_id) throws JsonProcessingException{
			
			
			//String email = ((ArrayList) formParams.get("email")).get(0).toString();
			
			//get all users
			List<UserEntity> users = userdao.getUsers(hackathon_id);
					
			ObjectMapper obj = new ObjectMapper();
			String result = obj.writeValueAsString(users);
			System.out.println("Result: " + result);
			
			return new ResponseEntity<String>(result, HttpStatus.OK);
		}
	  
	  
	  	  }


