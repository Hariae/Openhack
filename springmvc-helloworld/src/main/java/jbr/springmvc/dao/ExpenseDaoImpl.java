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

import jbr.springmvc.model.ExpenseEntity;
import jbr.springmvc.model.HackathonRegistrationEntity;
import jbr.springmvc.model.OrganizationEntity;


@Repository
@Transactional
public class ExpenseDaoImpl implements ExpenseDao{
	 @Autowired
	  DataSource datasource;
	  @Autowired
	  JdbcTemplate jdbcTemplate;
	  @PersistenceContext
	    private EntityManager manager;
	  
	public int addExpense(ExpenseEntity expense) {
		
		manager.persist(expense);
		return expense.getId();
	}
	
	public List<ExpenseEntity> getHackathonExpenses(int hackathon_id) {
	    javax.persistence.Query queryResult = manager.createQuery("SELECT w FROM ExpenseEntity w WHERE w.hackathon_id=:hackathon_id");
		queryResult.setParameter("hackathon_id", hackathon_id);
		List<Object> result = queryResult.getResultList();
	    System.out.println(result);
	    List<ExpenseEntity> e = new ArrayList<ExpenseEntity>();
	    
	    List<ExpenseEntity> expenseResult = new ArrayList<ExpenseEntity>();
		for(int i=0;i<result.size();i++) {
			ExpenseEntity entity = (ExpenseEntity) result.get(i);
			expenseResult.add(entity);
		}
	    
		return expenseResult;
	}

}
