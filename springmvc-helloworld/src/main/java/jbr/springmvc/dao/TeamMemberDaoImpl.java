package jbr.springmvc.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import jbr.springmvc.model.HackathonRegistrationEntity;
import jbr.springmvc.model.TeamMemberEntity;
import jbr.springmvc.model.UserEntity;

@Repository
@Transactional
public class TeamMemberDaoImpl implements TeamMembersDao{
	
	@Autowired
	  DataSource datasource;
	  @Autowired
	  JdbcTemplate jdbcTemplate;
		@PersistenceContext
	    private EntityManager manager;
	
		
		public List<TeamMemberEntity> getTeams(int id){
		
		javax.persistence.Query query = manager.createQuery("SELECT u FROM TeamMemberEntity u WHERE u.team_id=:id");		
		query.setParameter("id", id);
	

		List<TeamMemberEntity> result = query.getResultList();
		
		return result;
	}


		public List<String> getTeamMembers(int team_id) {
			// TODO Auto-generated method stub
			
			javax.persistence.Query query = manager.createQuery("SELECT b.screen_name FROM TeamMemberEntity a, UserEntity b WHERE a.team_id=:team_id AND a.member_id = b.id");		
			query.setParameter("team_id", team_id);
			
			List<String> teamMembers = query.getResultList();
			return teamMembers;
		}


		public List<UserEntity> getHackathonWinners(int hackathon_id) {
			// TODO Auto-generated method stub
			
			
			//SELECT email from hackathon_registration a, team_members b, user c 
			//where hackathon_id = 45 AND a.id = b.team_id AND c.id = b.member_id ORDER BY score DESC LIMIT 3
			
			javax.persistence.Query query = manager.createQuery("SELECT c FROM HackathonRegistrationEntity a, TeamMemberEntity b, UserEntity c"
					+ " WHERE a.hackathon_id = :hackathon_id AND a.id = b.team_id AND c.id = b.member_id ORDER BY a.score DESC");		
			
			query.setParameter("hackathon_id", hackathon_id);
			query.setMaxResults(3);
			List<UserEntity> teamMembers = query.getResultList();
			return teamMembers;
			
			//return null;
		}

}
