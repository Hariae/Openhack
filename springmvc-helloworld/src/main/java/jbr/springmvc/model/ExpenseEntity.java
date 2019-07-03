package jbr.springmvc.model;

import java.util.*;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="expense")
public class ExpenseEntity {
	
	@Id
	@GeneratedValue
	private Integer id;
	
	private int hackathon_id;
	private String title;
	private String description;
	private String time_stamp;
	private float amount;
	
	
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public float getAmount() {
		return amount;
	}
	public void setAmount(float amount) {
		this.amount = amount;
	}
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public int getHackathon_id() {
		return hackathon_id;
	}
	public void setHackathon_id(int hackathon_id) {
		this.hackathon_id = hackathon_id;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getTime_stamp() {
		return time_stamp;
	}
	public void setTime_stamp(String time_stamp) {
		this.time_stamp = time_stamp;
	}

}
