package jbr.springmvc.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="team_members")
public class TeamMemberEntity {
	@Id
	@GeneratedValue
	private int id;
	private int team_id;
	private int member_id;
	private String role;
	@Column(name = "payment", columnDefinition = "BIT", length = 1)
	private boolean payment;
	@Column(name = "team_lead", columnDefinition = "BIT", length = 1)
	private boolean team_lead;
	private Float amount_paid;
	private String time_stamp;
	
	public int getTeam_id() {
		return team_id;
	}
	public void setTeam_id(int team_id) {
		this.team_id = team_id;
	}
	public int getMember_id() {
		return member_id;
	}
	public void setMember_id(int member_id) {
		this.member_id = member_id;
	}
	public String getRole() {
		return role;
	}
	public void setRole(String role) {
		this.role = role;
	}
	public boolean isPayment() {
		return payment;
	}
	public void setPayment(boolean payment) {
		this.payment = payment;
	}
	public boolean isTeam_lead() {
		return team_lead;
	}
	public void setTeam_lead(boolean team_lead) {
		this.team_lead = team_lead;
	}
	public Float getAmount_paid() {
		return amount_paid;
	}
	public void setAmount_paid(Float amount_paid) {
		this.amount_paid = amount_paid;
	}
	public String getTime_stamp() {
		return time_stamp;
	}
	
	public void setTime_stamp(String time_stamp) {
		this.time_stamp = time_stamp;
	}

}
