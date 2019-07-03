package jbr.springmvc.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="organization")
public class OrganizationEntity {
	
	@Id
	@GeneratedValue
	private Integer id;
	private String name;
	private String address;
	private String description;
	private Integer owner;
//	private String user_name;
//	private Integer user_id;
	
	public OrganizationEntity() {}

	public Integer getOwner() {
		return owner;
	}
	public void setOwner(Integer owner) {
		this.owner = owner;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}

//	public String getuser_name() {
//		return user_name;
//	}
//
//	public void setuser_name(String user_name) {
//		this.user_name = user_name;
//	}

//	public Integer getUser_id() {
//		return user_id;
//	}
//
//	public void setUser_id(Integer user_id) {
//		this.user_id = user_id;
//	}
}
