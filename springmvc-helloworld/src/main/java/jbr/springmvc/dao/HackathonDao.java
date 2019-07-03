package jbr.springmvc.dao;

import jbr.springmvc.model.HackathonEntity;
import jbr.springmvc.model.HackathonRegistrationEntity;
import jbr.springmvc.model.TeamMemberEntity;
import jbr.springmvc.model.UserEntity;

import java.util.*;

public interface HackathonDao {
	
	public int addHackathon(HackathonEntity hackathon);
	
	public List<HackathonEntity> getHackathons();
	
	public HackathonEntity getHackathon(String id);
	
	public int addHackathonRegistration(HackathonRegistrationEntity hackathonRegistration);
	
	public void addHackathonTeamMember(TeamMemberEntity teamMember);
	
	public TeamMemberEntity getTeamMember(int team_id, int member_id);

	public List<TeamMemberEntity> getTeamMembers(int team_id);
	
	public UserEntity getTeamLead(int team_id);
	
	public HackathonRegistrationEntity getHackathonRegistration(int team_id);
	
	public List<HackathonRegistrationEntity> getRegisteredHackathons(int member_id);

	public List<HackathonEntity> getHackathonsWhereNotJudge(int id);
	
	public List<UserEntity> getHackathonParticipantEmails(int hackathon_id);
	
	public List<HackathonEntity> getFinalizedHackathons();
	
	public List<HackathonRegistrationEntity> getTeamsByName(String team_name);
}
