package jbr.springmvc.dao;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
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
import jbr.springmvc.model.JudgeEntity;
@Repository
@Transactional
public class JudgeDaoImpl implements JudgeDao {
	 @Autowired
	  DataSource datasource;
	  @Autowired
	  JdbcTemplate jdbcTemplate;
	  
		@PersistenceContext
	    private EntityManager manager;
		
	public void addJudge(JudgeEntity judge) {
		// TODO Auto-generated method stub
		
		manager.persist(judge);
		
	}
	
	
	  public List<HackathonRegistrationEntity> getTeamsForGrading(int judge_id, int hackathon_id ){
	  
	  
	  String query = "Select a from HackathonRegistrationEntity a, JudgeEntity b "
	  + "WHERE a.hackathon_id = b.hackathon_id AND a.hackathon_id = :hackathon_id AND b.judge_id = :judge_id ";
	  
	  javax.persistence.Query queryResult = manager.createQuery(query);
	  queryResult.setParameter("judge_id", judge_id); 
	  queryResult.setParameter("hackathon_id", hackathon_id); 
	  List<Object> result = queryResult.getResultList();
	  
	  List<HackathonRegistrationEntity> hackathonResult = new
	  ArrayList<HackathonRegistrationEntity>();
	  for(int i=0;i<result.size();i++) {
	  HackathonRegistrationEntity entity = (HackathonRegistrationEntity)
	  result.get(i);
	  hackathonResult.add(entity); }
	  
	  
	  return hackathonResult;
	  }
	 
	
	
	public List<HackathonEntity> getHackathonsForGrading(int judge_id){
		
		DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd");
		LocalDate localDate = LocalDate.now();
		System.out.println(localDate);
		String query = "Select a from HackathonEntity a, JudgeEntity b "
				+ "WHERE a.id = b.hackathon_id AND b.judge_id = :judge_id AND  a.close_date <= SYSDATE() AND ( a.finalize_date IS NULL OR a.finalize_date >= SYSDATE() )" ;
		
		javax.persistence.Query queryResult = manager.createQuery(query); 
		queryResult.setParameter("judge_id", judge_id);
		//queryResult.setParameter("localDate", localDate);
		List<Object> result = queryResult.getResultList();
		
		List<HackathonEntity> hackathonResult = new ArrayList<HackathonEntity>();
		for(int i=0;i<result.size();i++) {
			HackathonEntity entity = (HackathonEntity) result.get(i);
			hackathonResult.add(entity);
		}
		
		
		return hackathonResult;
	}


	public List<HackathonEntity> viewScoreboardHackathon(int judge_id){
		
		String query = "Select a from HackathonEntity a, JudgeEntity b "
				+ "WHERE a.id = b.hackathon_id AND b.judge_id = :judge_id AND a.finalize_date <= SYSDATE()" ;
		
		javax.persistence.Query queryResult = manager.createQuery(query); 
		queryResult.setParameter("judge_id", judge_id);
		//queryResult.setParameter("localDate", localDate);
		List<Object> result = queryResult.getResultList();
		
		List<HackathonEntity> hackathonResult = new ArrayList<HackathonEntity>();
		for(int i=0;i<result.size();i++) {
			HackathonEntity entity = (HackathonEntity) result.get(i);
			hackathonResult.add(entity);
		}
		
		
		return hackathonResult;
	}


	public List<HackathonRegistrationEntity> getTeamScores(int hackathon_id) {
		// TODO Auto-generated method stub
		
		String query = "Select a from HackathonRegistrationEntity a WHERE a.hackathon_id = :hackathon_id";
		javax.persistence.Query queryResult = manager.createQuery(query);
		queryResult.setParameter("hackathon_id", hackathon_id);
		
		List<HackathonRegistrationEntity> result = queryResult.getResultList();
		
		
		
		return result;
	}


	public List<String> getJudgeEmails(int hackathon_id) {
		// TODO Auto-generated method stub
		String queryString = "Select b.email from JudgeEntity a, UserEntity b WHERE a.hackathon_id = :hackathon_id AND a.judge_id = b.id";
		javax.persistence.Query query = manager.createQuery(queryString);
		query.setParameter("hackathon_id", hackathon_id);
		List<String> judgeEmails = query.getResultList();
		
		return judgeEmails;
		
		
	}
	

}
