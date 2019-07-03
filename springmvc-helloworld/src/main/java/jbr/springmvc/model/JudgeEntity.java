package jbr.springmvc.model;
import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import javax.persistence.*;

@Entity
@Table(name="judge")
public class JudgeEntity {
	
	@Id
	@GeneratedValue
	private Integer id;
	
	private Integer hackathon_id;
	
	private Integer judge_id;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Integer getHackathon_id() {
		return hackathon_id;
	}

	public void setHackathon_id(Integer hackathon_id) {
		this.hackathon_id = hackathon_id;
	}

	public Integer getJudge_id() {
		return judge_id;
	}

	public void setJudge_id(Integer judge_id) {
		this.judge_id = judge_id;
	}


	
	
}