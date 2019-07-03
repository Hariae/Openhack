package jbr.springmvc.dao;

import java.util.List;

import jbr.springmvc.model.HackathonEntity;
import jbr.springmvc.model.HackathonRegistrationEntity;
import jbr.springmvc.model.JudgeEntity;

public interface JudgeDao {

	
	public void addJudge (JudgeEntity judge);

	public List<HackathonEntity> getHackathonsForGrading(int id);
	
	public List<HackathonEntity> viewScoreboardHackathon(int id);

	public List<HackathonRegistrationEntity> getTeamsForGrading(int id, int hackathon_id);
	
	public List<HackathonRegistrationEntity> getTeamScores(int hackathon_id);
	
	public List<String> getJudgeEmails(int hackathon_id);
	
	
	
	
}
