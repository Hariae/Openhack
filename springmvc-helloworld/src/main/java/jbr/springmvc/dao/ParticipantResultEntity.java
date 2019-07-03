package jbr.springmvc.dao;

import javax.persistence.Entity;

import org.hibernate.annotations.Columns;

@Entity
public class ParticipantResultEntity {
	
	
	private String email;
	private Integer id;
	
	
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	
	  public Integer getId() { return id; } 
	  
	  public void setId(Integer id) { this.id
	  = id; }
	 
	

}
