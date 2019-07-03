package jbr.springmvc.dao;

import java.util.List;

import jbr.springmvc.model.OrganizationEntity;
import jbr.springmvc.model.OrganizationRequestEntity;

public interface OrganizationRequestDao {
	
	public List<OrganizationRequestEntity> getOrganizationRequests(Integer organization_id);
	
	//public OrganizationRequestEntity getOrganizationRequests(Integer organization_id);

	public void addOrganizationRequest(OrganizationRequestEntity org);
	
	public void RemoveAcceptedRequest(Integer user_id, Integer organization_id);
	
	public List<OrganizationRequestEntity> getAllOrganizationRequests();
	
}
