package jbr.springmvc.dao;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import jbr.springmvc.model.HackathonEntity;
import jbr.springmvc.model.HackathonRegistrationEntity;
import jbr.springmvc.model.JudgeEntity;
import jbr.springmvc.model.UserEntity;

@Repository
@Transactional
public class HackathonRegistrationDaoImpl implements HackathonRegistrationDao {
	 @Autowired
	  DataSource datasource;
	  @Autowired
	  JdbcTemplate jdbcTemplate;
		@PersistenceContext
	    private EntityManager manager;
	public void updateScore(HackathonRegistrationEntity hackathonregistration) {
		
		manager.persist(hackathonregistration);
		
	}
	
	public HackathonRegistrationEntity getHackathon(String team_name) {
	    HackathonRegistrationEntity hackathonregistration = null;
	    javax.persistence.Query query = manager.createQuery("SELECT u FROM HackathonRegistrationEntity u WHERE u.team_name=:team_name");
	    query.setParameter("team_name", team_name);
	    try {
	    	hackathonregistration = (HackathonRegistrationEntity) query.getSingleResult();
	    } catch (Exception e) {
	        // Handle exception
	    }
	    return hackathonregistration;
	}
	
	

	public List<HackathonRegistrationEntity> getNonGradedHackathons(int hackathon_id) {
		// TODO Auto-generated method stub
		javax.persistence.Query query = manager.createQuery("SELECT u FROM HackathonRegistrationEntity u WHERE u.hackathon_id=:hackathon_id AND u.score IS NULL");		
		query.setParameter("hackathon_id", hackathon_id);
		
		List<HackathonRegistrationEntity> result = query.getResultList();
		
		System.out.println(result);
		System.out.println("size : " + result.size());
		
		return result;
	}
	
	public List<HackathonRegistrationEntity> getGradedHackathons(int hackathon_id) {
		// TODO Auto-generated method stub
		javax.persistence.Query query = manager.createQuery("SELECT u FROM HackathonRegistrationEntity u WHERE u.hackathon_id=:hackathon_id AND u.score IS NOT NULL");		
		query.setParameter("hackathon_id", hackathon_id);
		
		List<HackathonRegistrationEntity> result = query.getResultList();
		
		System.out.println(result);
		System.out.println("size : " + result.size());
		
		return result;
	}
	
	public List<HackathonRegistrationEntity> getAllRegistrations(int hackathon_id){
		
		javax.persistence.Query query = manager.createQuery("SELECT u FROM HackathonRegistrationEntity u WHERE u.hackathon_id=:hackathon_id");		
		query.setParameter("hackathon_id", hackathon_id);
		
		List<HackathonRegistrationEntity> result = query.getResultList();
		//System.out.println("size : " + result.size());
		
		return result;
		
		
		
	}

}
