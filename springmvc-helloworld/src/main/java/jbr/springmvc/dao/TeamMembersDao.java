package jbr.springmvc.dao;

import java.util.List;

import jbr.springmvc.model.HackathonRegistrationEntity;
import jbr.springmvc.model.TeamMemberEntity;
import jbr.springmvc.model.UserEntity;

public interface TeamMembersDao {

	public List<TeamMemberEntity> getTeams(int id);
	
	public List<String> getTeamMembers(int team_id);
	
	public List<UserEntity> getHackathonWinners(int hackathon_id);
}
