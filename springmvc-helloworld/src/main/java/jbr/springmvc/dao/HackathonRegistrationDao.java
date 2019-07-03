package jbr.springmvc.dao;

import java.util.List;

import jbr.springmvc.model.HackathonRegistrationEntity;
import jbr.springmvc.model.UserEntity;

public interface HackathonRegistrationDao {
	public void updateScore(HackathonRegistrationEntity hackathonregistration);
	
	public HackathonRegistrationEntity getHackathon(String team_name);
	
	public List<HackathonRegistrationEntity> getNonGradedHackathons(int hackathon_id);
	
	public List<HackathonRegistrationEntity> getGradedHackathons(int hackathon_id);
	
	public List<HackathonRegistrationEntity> getAllRegistrations(int hackathon_id);
	
}
