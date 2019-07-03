
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
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import jbr.springmvc.dao.OrganizationDao;
import jbr.springmvc.dao.OrganizationRequestDao;
import jbr.springmvc.dao.UserDao;
import jbr.springmvc.model.OrganizationEntity;
import jbr.springmvc.model.OrganizationRequestEntity;
import jbr.springmvc.model.UserEntity;

@CrossOrigin(origins = "*", maxAge = 3600)
@Controller
@RequestMapping("/OrganizationRequests")
public class OrganizationRequestController {
	@Autowired
	public OrganizationRequestDao orgReqDao;
	
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
	
	@RequestMapping(value="/{organization_id}", method = RequestMethod.GET)
	@Transactional
	public @ResponseBody ResponseEntity<String> byParameter (@PathVariable String organization_id) {

		System.out.println("organization id of the user fetching organziations is "+organization_id);
		Integer org_id = Integer.parseInt(organization_id);
		try {
			List<OrganizationRequestEntity> orgReqValues = orgReqDao.getOrganizationRequests(org_id);
			List<OrganizationRequestEntity> orgReqValues1 = new ArrayList<OrganizationRequestEntity>();
			for(int i=0;i<orgReqValues.size();i++) {
				if(orgReqValues.get(i).getOrganization_id()==org_id) {
					orgReqValues1.add(orgReqValues.get(i));
				}
			}
			ObjectMapper obj = new ObjectMapper();
			String result = obj.writeValueAsString(orgReqValues1);
			System.out.println("result of one organization join requests from user: "+result);
			return new ResponseEntity<String>(result, HttpStatus.OK);

		} 
		catch (Exception e) {
			return new ResponseEntity<String>(HttpStatus.NOT_FOUND);
		}
	}
	
	
	@RequestMapping(value = "/AcceptRequest", method = RequestMethod.POST)

	@ResponseBody

	@Transactional
	public ResponseEntity<String> addUserToOrganization(@RequestBody MultiValueMap formParams)
	
	throws Exception 
	{	
		System.out.println("from add user to  orgnaization manager "+((ArrayList) formParams.get("user_id")).get(0).toString());
		Integer user_id = Integer.valueOf(((ArrayList) formParams.get("user_id")).get(0).toString());
		Integer organization_id = Integer.valueOf(((ArrayList) formParams.get("organization_id")).get(0).toString());
//		OrganizationEntity org;
		UserEntity user;
			try {
				user = userdao.getUserbyId(user_id);
//				org = orgDao.getUserOrganization(organization_id);
			
				if (user == null) {
					throw new UserNotFoundException();
				}
			} catch (Exception e) {
				return new ResponseEntity<String>(HttpStatus.NOT_FOUND);
			}
			/* User Info */
//			List<OrganizationEntity> organizations = orgDao.getAllOrganizations();
//			System.out.println("users"+organizations);

//			OrganizationEntity organization = new OrganizationEntity();
	
//			organization.setName(org.getName());
//			organization.setAddress(org.getAddress());
//			organization.setDescription(org.getDescription());
//			organization.setOwner(org.getOwner());
//			organization.setUser_id(user_id);
			
//			orgDao.addOrganization(organization);
			
			
			/* Add organization name to user table */
//			commenting
			user.setOrganization_id(organization_id);
//			comment ends
			userdao.updateUser(user);
		
			orgReqDao.RemoveAcceptedRequest(user_id, organization_id);
			return new ResponseEntity<String>(HttpStatus.OK);
	}
	@RequestMapping(value = "/joinOrganization", method = RequestMethod.POST)

	@ResponseBody

	@Transactional
	public void insertRequest(@RequestBody MultiValueMap formParams)

			throws Exception {
		System.out.println(formParams);
		String email = ((ArrayList) formParams.get("email")).get(0).toString();
		Integer organization_id =(Integer) ((ArrayList) formParams.get("organization_id")).get(0);
		UserEntity user = userdao.getUser(new String(email));
	    Integer user_id = user.getId();
//	    List<OrganizationRequestEntity> orgReq = orgReqDao.getOrganizationRequests(user_id);
	    List<OrganizationRequestEntity> orgReq = orgReqDao.getAllOrganizationRequests();
	    System.out.println("orgreq"+orgReq);
	    boolean userPresent = false;
	    for(int i=0;i<orgReq.size();i++) {
	    	if(orgReq.get(i).getUser_id()==user_id && orgReq.get(i).getOrganization_id()==organization_id) {
	    		userPresent = true;
	    		break;
	    	}
	    }
	    if(userPresent==false) {
	    OrganizationRequestEntity org = new OrganizationRequestEntity();
	    org.setUser_id(user_id);
	    org.setOrganization_id(organization_id);
	    orgReqDao.addOrganizationRequest(org);
	    }
	    

}
	@RequestMapping(value = "/deleteUserJoinRequest", method = RequestMethod.POST)

	@ResponseBody

	@Transactional
	public void deleteRequest(@RequestBody MultiValueMap formParams)

			throws Exception {
		System.out.println(formParams);
		Integer user_id =Integer.valueOf((String) ((ArrayList) formParams.get("user_id")).get(0));
		Integer organization_id =(Integer) ((ArrayList) formParams.get("organization_id")).get(0);
		
	    OrganizationRequestEntity org = new OrganizationRequestEntity();
	    orgReqDao.RemoveAcceptedRequest(user_id, organization_id);

}
}
