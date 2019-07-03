package jbr.springmvc.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;

import jbr.springmvc.model.OrganizationEntity;
import jbr.springmvc.model.UserEntity;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@Transactional
public class OrganizationDaoImpl implements OrganizationDao{

	 @Autowired
	  DataSource datasource;
	  @Autowired
	  JdbcTemplate jdbcTemplate;
	  
	  @PersistenceContext
	    private EntityManager manager;
		
		public List<OrganizationEntity> getAllOrganizations(){
			List<OrganizationEntity> organization = manager.createQuery("Select a From OrganizationEntity a", OrganizationEntity.class).getResultList();
			System.out.println("orgnanization get"+organization);
			return organization;
		}
		
		public OrganizationEntity getUserOrganization(Integer user_id) {
		    OrganizationEntity organizationsList = null;
		    javax.persistence.Query query = manager.createQuery("SELECT w FROM OrganizationEntity w WHERE w.id=:user_id");
		    query.setParameter("user_id", user_id);
		    try {
		    	organizationsList = (OrganizationEntity) query.getSingleResult();
		    } catch (Exception e) {
		        // Handle exception
		    }
		    return organizationsList;
		}
		
		public void addOrganization(OrganizationEntity organization) {
			// TODO Auto-generated method stub		
				System.out.println("manager"+ manager);
				manager.persist(organization);
		}

		public OrganizationEntity getOrganization(Integer id) {
			OrganizationEntity org = manager.find(OrganizationEntity.class, id);
			return org;
		}
		
		
}
