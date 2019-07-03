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
import jbr.springmvc.model.RegisteredHackathonResultEntity;
import jbr.springmvc.model.TeamMemberEntity;
import jbr.springmvc.model.UserEntity;

@Repository
@Transactional
public class HackathonDaoImpl implements HackathonDao{
	  
	  @Autowired
	  DataSource datasource;
	  @Autowired
	  JdbcTemplate jdbcTemplate;
	  @PersistenceContext
	    private EntityManager manager;
	  
	public int addHackathon(HackathonEntity hackathon) {
		// TODO Auto-generated method stub
		
		manager.persist(hackathon);
		return hackathon.getId();
		
		
	}

	public List<HackathonEntity> getHackathons() {
		// TODO Auto-generated method stub
		
		List<HackathonEntity> hackathons = manager.createQuery("Select a From HackathonEntity a", HackathonEntity.class)
				.getResultList();
		return hackathons;
		
	}
	
	public List<HackathonEntity> getHackathonsWhereNotJudge(int judge_id) {
		// TODO Auto-generated method stub
		String query = "select a from HackathonEntity a where a.id NOT IN (select hackathon_id from JudgeEntity where judge_id IN (:judge_id))";
	    javax.persistence.Query queryResult = manager.createQuery(query);
		queryResult.setParameter("judge_id", judge_id);
		//queryResult.setParameter("localDate", localDate);
		List<Object> result = queryResult.getResultList();
		
		List<HackathonEntity> hackathon = new ArrayList<HackathonEntity>();
		for(int i=0;i<result.size();i++) {
			HackathonEntity entity = (HackathonEntity) result.get(i);
			hackathon.add(entity);
		}
		return hackathon;
	}
	
	

	public HackathonEntity getHackathon(String hackathonId) {
		// TODO Auto-generated method stub
		//HackathonEntity hackathon = manager.createQuery("Select a From HackathonEntity a WHERE a.id=:hackathonId", HackathonEntity.class).getSingleResult();
		HackathonEntity hackathon = manager.find(HackathonEntity.class, Integer.parseInt(hackathonId));
		return hackathon;
	}
	
	public int addHackathonRegistration(HackathonRegistrationEntity hackathonRegistration) {
		manager.persist(hackathonRegistration);
		return hackathonRegistration.getHackathonRegistrationId();
	}
	
	

	public void addHackathonTeamMember(TeamMemberEntity teamMember) {
		// TODO Auto-generated method stub
		manager.persist(teamMember);
		
	}

	public TeamMemberEntity getTeamMember(int team_id, int member_id) {
		// TODO Auto-generated method stub
		//TeamMemberEntity teamMember = manager.createQuery("Select a From TeamMemberEntity a WHERE a.team_id=:team_id AND a.member_id=:member_id", TeamMemberEntity.class).getSingleResult();
		
		List<TeamMemberEntity> teamMembers = manager.createQuery("Select a From TeamMemberEntity a", TeamMemberEntity.class)
				.getResultList();
		
		TeamMemberEntity teamMember = new TeamMemberEntity();
		
		for(TeamMemberEntity mem : teamMembers) {
			if(mem.getTeam_id() == team_id && mem.getMember_id() == member_id) {
				teamMember = mem;
			}
		}
		return teamMember;
	}

	public HackathonRegistrationEntity getHackathonRegistration(int team_id) {
		// TODO Auto-generated method stub
		HackathonRegistrationEntity hackathonRegistration = manager.find(HackathonRegistrationEntity.class, team_id);
		return hackathonRegistration;
	}

	public List<HackathonRegistrationEntity> getRegisteredHackathons(int member_id) {
		// TODO Auto-generated method stub
		
		
		String query = "Select a from HackathonRegistrationEntity a, TeamMemberEntity b "
				+ "WHERE a.id = b.team_id AND b.member_id = :member_id";
		
		javax.persistence.Query queryResult = manager.createQuery(query); 
		queryResult.setParameter("member_id", member_id);
		List<Object> result = queryResult.getResultList();
		
		List<HackathonRegistrationEntity> hackathonResult = new ArrayList<HackathonRegistrationEntity>();
		for(int i=0;i<result.size();i++) {
			HackathonRegistrationEntity entity = (HackathonRegistrationEntity) result.get(i);
			hackathonResult.add(entity);
		}
		
		
		return hackathonResult;
		
	}

	public List<TeamMemberEntity> getTeamMembers(int team_id) {
		// TODO Auto-generated method stub
		javax.persistence.Query query = manager.createQuery("SELECT u From TeamMemberEntity u WHERE u.team_id=:team_id");
		query.setParameter("team_id", team_id);
		List<TeamMemberEntity> teamMembers  = query.getResultList();
		return teamMembers;
	}

	public UserEntity getTeamLead(int team_id) {
		// TODO Auto-generated method stub
		javax.persistence.Query query = manager.createQuery("SELECT a From UserEntity a, TeamMemberEntity u WHERE a.id = u.member_id AND u.team_id=:team_id AND team_lead = true");
		query.setParameter("team_id", team_id);
		UserEntity teamLead = (UserEntity)query.getSingleResult();		
		return teamLead;
	}

	public List<UserEntity> getHackathonParticipantEmails(int hackathon_id) {
		// TODO Auto-generated method stub
		
		//select email from team_members a, hackathon_registration b, user c where  b.hackathon_id = 6 AND a.team_id = b.id AND a.member_id = c.id; 
		String queryString = "SELECT c from TeamMemberEntity a, HackathonRegistrationEntity b, UserEntity c "
				+ "WHERE b.hackathon_id = :hackathon_id AND a.team_id = b.id AND a.member_id = c.id";
		
		javax.persistence.Query query = manager.createQuery(queryString);
		query.setParameter("hackathon_id", hackathon_id);		
		List<UserEntity> hackathonParticipantEmails = query.getResultList();	
		//System.out.print(hackathonParticipantEmails.get(0).getEmail());
		return hackathonParticipantEmails;
	}

	public List<HackathonEntity> getFinalizedHackathons() {
		// TODO Auto-generated method stub
		List<HackathonEntity> hackathons = manager.createQuery("Select a From HackathonEntity a WHERE a.finalize_date <= sysdate()", HackathonEntity.class)
				.getResultList();
		return hackathons;
		
	}

	public List<HackathonRegistrationEntity> getTeamsByName(String team_name) {
		// TODO Auto-generated method stub
		
		javax.persistence.Query query = manager.createQuery("Select a From HackathonRegistrationEntity a WHERE a.team_name = :team_name");
		query.setParameter("team_name", team_name);
		
		List<HackathonRegistrationEntity> teams = query.getResultList();
		
		
		
		return teams;
	}
	
	

	

}
