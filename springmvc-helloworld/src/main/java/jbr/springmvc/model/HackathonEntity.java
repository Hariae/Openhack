package jbr.springmvc.model;

import java.util.*;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="hackathon")
public class HackathonEntity {
	
	@Id
	@GeneratedValue
	private Integer id;
	private String event_name;
	private Date start_date;
	private Date end_date;
	private int registration_fee;
	private int min_size;
	private int max_size;
	private int sponsor_discount;
	private String description;
	private Date open_date;
	private Date close_date;
	private Date finalize_date;
	
	
	public String getEvent_name() {
		return event_name;
	}
	public void setEvent_name(String event_name) {
		this.event_name = event_name;
	}
	public Date getStart_date() {
		return start_date;
	}
	public void setStart_date(Date start_date) {
		this.start_date = start_date;
	}
	public Date getEnd_date() {
		return end_date;
	}
	public void setEnd_date(Date end_date) {
		this.end_date = end_date;
	}
	public int getRegistration_fee() {
		return registration_fee;
	}
	public void setRegistration_fee(int registration_fee) {
		this.registration_fee = registration_fee;
	}
	public int getMin_size() {
		return min_size;
	}
	public void setMin_size(int min_size) {
		this.min_size = min_size;
	}
	public int getMax_size() {
		return max_size;
	}
	public void setMax_size(int max_size) {
		this.max_size = max_size;
	}
	public int getSponsor_discount() {
		return sponsor_discount;
	}
	public void setSponsor_discount(int sponsor_discount) {
		this.sponsor_discount = sponsor_discount;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public Date getOpen_date() {
		return open_date;
	}
	public void setOpen_date(Date open_date) {
		this.open_date = open_date;
	}
	public Date getClose_date() {
		return close_date;
	}
	public void setClose_date(Date close_date) {
		this.close_date = close_date;
	}
	
	public int getId() {
		return this.id;
	}
	public Date getFinalize_date() {
		return finalize_date;
	}
	public void setFinalize_date(Date finalize_date) {
		this.finalize_date = finalize_date;
	}

	
	
}
