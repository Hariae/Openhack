package jbr.springmvc.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="hackathon_registration")
public class HackathonRegistrationEntity {
	
	@Id
	@GeneratedValue
	private int id;
	private int hackathon_id;
	private String team_name;
	private String submission_url;
	@Column(name = "approved", columnDefinition = "BIT", length = 1)
	private boolean approved;
	private Float score;
	
	
	public int getId() {
		return id;
	}
	
	public int getHackathonRegistrationId() {
		return this.id;
	}
	public int getHackathon_id() {
		return hackathon_id;
	}
	public void setHackathon_id(int hackathon_id) {
		this.hackathon_id = hackathon_id;
	}
	
	public String getTeam_name() {
		return team_name;
	}
	public void setTeam_name(String team_name) {
		this.team_name = team_name;
	}
	public String getSubmission_url() {
		return submission_url;
	}
	public void setSubmission_url(String submission_url) {
		this.submission_url = submission_url;
	}
	public boolean isApproved() {
		return approved;
	}
	public void setApproved(boolean approved) {
		this.approved = approved;
	}
	public Float getScore() {
		return score;
	}
	
	public void setScore(Float score) {
		this.score = score;
	}
	
}
