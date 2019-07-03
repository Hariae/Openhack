package jbr.springmvc.dao;

import java.util.List;

import jbr.springmvc.model.HackathonEntity;
import jbr.springmvc.model.OrganizationEntity;
import jbr.springmvc.model.UserEntity;

public interface OrganizationDao {
	
	public List<OrganizationEntity> getAllOrganizations();
		
	public void addOrganization(OrganizationEntity organization);
	
	public OrganizationEntity getUserOrganization (Integer user_id);

	public OrganizationEntity getOrganization(Integer id);

		

}


