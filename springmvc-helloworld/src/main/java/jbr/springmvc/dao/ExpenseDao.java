package jbr.springmvc.dao;

import java.util.List;

import jbr.springmvc.model.ExpenseEntity;
import jbr.springmvc.model.HackathonEntity;

public interface ExpenseDao {
	
	public int addExpense(ExpenseEntity expense);
	
	public List<ExpenseEntity> getHackathonExpenses(int integer);

}
