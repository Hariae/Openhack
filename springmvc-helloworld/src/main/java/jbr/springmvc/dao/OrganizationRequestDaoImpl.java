package jbr.springmvc.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;

import jbr.springmvc.model.OrganizationEntity;
import jbr.springmvc.model.OrganizationRequestEntity;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@Transactional
public class OrganizationRequestDaoImpl implements OrganizationRequestDao{

	 @Autowired
	  DataSource datasource;
	  @Autowired
	  JdbcTemplate jdbcTemplate;
	  
	  @PersistenceContext
	    private EntityManager manager;
		
		public List<OrganizationRequestEntity> getOrganizationRequests(Integer organization_id) {
			// TODO Auto-generated method stub
			System.out.println("org_id"+organization_id);
//			List<OrganizationRequestEntity> organizationsRequestList = (List<OrganizationRequestEntity>) manager.createQuery("SELECT w FROM OrganizationRequestEntity w WHERE w.organization_id=:organization_id");
			List<OrganizationRequestEntity> organizationsRequestList= manager.createQuery("SELECT w FROM OrganizationRequestEntity w", OrganizationRequestEntity.class).getResultList();

		    return organizationsRequestList;
//		    return null;
		}

	/*
	 * OrganizationRequestEntity organizationRequestList = null;
	 * javax.persistence.Query query = manager.
	 * createQuery("SELECT w FROM organization_request w WHERE w.organization_id=:organization_id"
	 * ); query.setParameter("organization_id", organization_id); try {
	 * organizationRequestList = (OrganizationRequestEntity)
	 * query.getSingleResult(); } catch (Exception e) { // Handle exception }
	 * 
	 * return organizationRequestList; // return null;
	 */	
		
	
	public void addOrganizationRequest(OrganizationRequestEntity organizationRequest) {
		// TODO Auto-generated method stub		
			System.out.println("manager"+ manager);
			manager.persist(organizationRequest);
	}
	

		public void RemoveAcceptedRequest(Integer user_id, Integer organization_id) {
			// TODO Auto-generated method stub
			javax.persistence.Query query = manager.createQuery("DELETE FROM OrganizationRequestEntity WHERE organization_id="+organization_id+" AND user_id="+user_id);
			query.executeUpdate();
		}

		public List<OrganizationRequestEntity> getAllOrganizationRequests() {
			// TODO Auto-generated method stub
			List<OrganizationRequestEntity> organization = manager.createQuery("Select a From OrganizationRequestEntity a", OrganizationRequestEntity.class).getResultList();
			System.out.println("orgnanization get"+organization);
			return organization;
			
		}

		
		
		
}
