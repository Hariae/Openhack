package jbr.springmvc.controller;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.databind.ObjectMapper;

import jbr.springmvc.dao.HackathonDao;
import jbr.springmvc.dao.HackathonRegistrationDao;
import jbr.springmvc.dao.SponsorDao;
import jbr.springmvc.dao.TeamMembersDao;
import jbr.springmvc.model.HackathonEntity;
import jbr.springmvc.model.HackathonRegistrationEntity;
import jbr.springmvc.model.SponsorEntity;
import jbr.springmvc.model.TeamMemberEntity;

@CrossOrigin(origins = "*", maxAge = 3600)
@Controller
@RequestMapping("/hackathon-earning-report")
public class EarningReportController {

	@Autowired
	public HackathonDao hackdao;
	
	@Autowired
	public HackathonRegistrationDao regdao;
	
	@Autowired
	public TeamMembersDao teamdao;

	@Autowired
	public SponsorDao sponsordao;
	
//	@Autowired
//	public TeamMembersDao teamdao;

	@PersistenceContext
	private EntityManager manager;
	
	@RequestMapping(value = "/**", method = RequestMethod.GET)
	public ResponseEntity handle() {
		return new ResponseEntity(HttpStatus.OK);
	}

	@RequestMapping(method = RequestMethod.GET)

	@ResponseBody

	@Transactional
	public ResponseEntity<String> getEarningReport(@RequestParam(value = "id", required = true) String id)

			throws Exception {
	
		
		HackathonEntity hack= hackdao.getHackathon(id);
		List<Integer> result=new ArrayList<Integer>() ;

		List<HackathonRegistrationEntity> allRegistrations =regdao.getAllRegistrations(Integer.parseInt(id));
	
		List<SponsorEntity> sponsors= sponsordao.getHackathonSponsors(Integer.parseInt(id));

		Integer spon_num=sponsors.size();
		float sum=0;
		int count=0;
		
	
		for(HackathonRegistrationEntity e: allRegistrations) {
			List<TeamMemberEntity> members= teamdao.getTeams(e.getHackathonRegistrationId());
		
			for(TeamMemberEntity m:members) {
				
				Float amount= m.getAmount_paid();
				//System.out.println(amount);
				if(amount != null) {
					//System.out.println("inside not null");
					sum=sum+amount;
				}else {
					count++;
					//System.out.println(count);
				}
			}
		}

		result.add((int) sum);
		result.add(count);
		result.add(spon_num);
		result.add(hack.getRegistration_fee());
		
		ObjectMapper obj = new ObjectMapper();
		String res = obj.writeValueAsString(result);
	
		return new ResponseEntity<String>( res, HttpStatus.OK);
	
	}
	
	
}
