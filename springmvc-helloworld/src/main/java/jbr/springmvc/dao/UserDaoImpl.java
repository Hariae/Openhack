package jbr.springmvc.dao;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.PersistenceException;
import javax.sql.DataSource;

import org.hibernate.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import jbr.springmvc.User;
import jbr.springmvc.model.HackathonEntity;
import jbr.springmvc.model.UserEntity;

//import jbr.springmvc.Employee;

@Repository
@Transactional
public class UserDaoImpl implements UserDao{

	 @Autowired
	  DataSource datasource;
	  @Autowired
	  JdbcTemplate jdbcTemplate;
	  
	/*
	 * public void register(Employee employee) { String sql = "select * from users";
	 * System.out.println("INSIDE" + jdbcTemplate); List<Map<String, Object>>
	 * employees = jdbcTemplate.queryForList(sql); System.out.println(employees);
	 * 
	 * 
	 * }
	 */
	
	@PersistenceContext
    private EntityManager manager;
	
	public List<UserEntity> getAllUsers(){
		List<UserEntity> users = manager.createQuery("Select a From UserEntity a", UserEntity.class).getResultList();
		return users;
	}
	
	
	
	public void addUser(UserEntity user) {
		// TODO Auto-generated method stub		
			System.out.println("manager"+ manager);
			manager.persist(user);
	}



	public UserEntity getUser(String email) {
	    UserEntity user = null;
	    UserEntity user1 = null;
	    System.out.println("email in Dao"+email);
	    javax.persistence.Query query = manager.createQuery("SELECT u FROM UserEntity u WHERE u.email=:email");
	    query.setParameter("email", email);
	    try {
	        user = (UserEntity) query.getSingleResult();
	    } catch (Exception e) {
	        // Handle exception
	    }
	    
        return user;
	}
	
	public UserEntity getUserByScreenName(String screen_name) {
	    UserEntity user = null;
	    javax.persistence.Query query = manager.createQuery("SELECT u FROM UserEntity u WHERE u.screen_name =:screen_name");
	    query.setParameter("screen_name", screen_name);
	    try {
	        user = (UserEntity) query.getSingleResult();
	    } catch (Exception e) {
	        // Handle exception
	    }
	    
        return user;
	}
	
	public void updateUser(UserEntity user) {
		manager.persist(user);
	}



	public UserEntity getUserbyId(Integer user_id) {
		// TODO Auto-generated method stub
		UserEntity user = manager.find(UserEntity.class, user_id);
		return user;
	}



	public List<UserEntity> getUsers(int hackathon_id) {
		// TODO Auto-generated method stub
		String query = "select a from UserEntity a, JudgeEntity b where b.hackathon_id =:hackathon_id AND a.id != b.judge_id";
	    javax.persistence.Query queryResult = manager.createQuery(query);
		queryResult.setParameter("hackathon_id", hackathon_id);
		//queryResult.setParameter("localDate", localDate);
		List<Object> result = queryResult.getResultList();
		
		List<UserEntity> users = new ArrayList<UserEntity>();
		for(int i=0;i<result.size();i++) {
			UserEntity entity = (UserEntity) result.get(i);
			users.add(entity);
		}
		
		
		return users;
	}

}

