package jbr.springmvc.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import jbr.springmvc.model.SponsorEntity;
@Repository
@Transactional
public class SponsorDaoImpl implements SponsorDao {
	 @Autowired
	  DataSource datasource;
	  @Autowired
	  JdbcTemplate jdbcTemplate;
	  
		@PersistenceContext
	    private EntityManager manager;
		
	public void addSponsor(SponsorEntity sponsor) {
		// TODO Auto-generated method stub
		
		manager.persist(sponsor);
		
	}

	public List<SponsorEntity> getSponsors(int hackathon_id, int organization_id) {
		// TODO Auto-generated method stub
		
		javax.persistence.Query query = manager.createQuery("SELECT u FROM SponsorEntity u WHERE u.hackathon_id=:hackathon_id AND u.organization_id=:organization_id");
	    query.setParameter("hackathon_id", hackathon_id);
	    query.setParameter("organization_id", organization_id);
	    
	    List<SponsorEntity> sponsors = query.getResultList();
		return sponsors;
	}
	
	public List<SponsorEntity> getHackathonSponsors(int id) {
		// TODO Auto-generated method stub
		
		javax.persistence.Query query = manager.createQuery("SELECT u FROM SponsorEntity u WHERE u.hackathon_id=:id");
	    query.setParameter("id", id);
	    
	    
	    List<SponsorEntity> sponsors = query.getResultList();
		return sponsors;
	}

}
