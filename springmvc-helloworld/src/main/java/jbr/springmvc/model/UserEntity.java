package jbr.springmvc.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import javax.persistence.*;

@Entity
@Table(name="user")
public class UserEntity {
	

		@Id
		@GeneratedValue
		private Integer id;
		
		private String email;
		
		private String screen_name;
		@Column(name = "role", columnDefinition = "BIT", length = 1)
		private boolean role;
		private String name;
		private String portrait_URL;
		private String business_title;
		private Integer organization_id;
		private String about_me;
		private String address;
		private String password;
	
	  @Column(name = "verified", columnDefinition = "BIT", length = 1) private
	  boolean verified;
	 
		
		
		public UserEntity() {}
		
		public UserEntity(String name) {
			this.name = name;
		}

		public Integer getId() {
			return id;
		}

		public void setId(Integer id) {
			this.id = id;
		}

		public String getEmail() {
			return email;
		}

		public void setEmail(String email) {
			this.email = email;
		}

		public String getScreen_name() {
			return screen_name;
		}

		public void setScreenName(String screen_name) {
			this.screen_name = screen_name;
		}

		public Boolean getRole() {
			return role;
		}

		public void setRole(Boolean role) {
			this.role = role;
		}
		
	
	  public Boolean getVerified() { return verified; }
	  
	  public void setVerified(Boolean verified) { this.verified = verified; }
	 

		public String getName() {
			return name;
		}

		public void setName(String name) {
			this.name = name;
		}

		public String getPortraitURL() {
			return portrait_URL;
		}

		public void setPortraitURL(String portrait_URL) {
			this.portrait_URL = portrait_URL;
		}

		public String getBusinessTitle() {
			return business_title;
		}

		public void setBusinessTitle(String business_title) {
			this.business_title = business_title;
		}

		public Integer getOrganization_id() {
			return organization_id;
		}

		public void setOrganization_id(Integer organization_id) {
			this.organization_id = organization_id;
		}

		public String getAboutMe() {
			return about_me;
		}

		public void setAboutMe(String about_me) {
			this.about_me = about_me;
		}

		public String getAddress() {
			return address;
		}

		public void setAddress(String address) {
			this.address = address;
		}

		public String getPassword() {
			return password;
		}

		public void setPassword(String password) {
			this.password = password;
		}

	/*
	 * public Integer getOrganization_id() { return organization_id; }
	 * 
	 * public void setOrganization_id(Integer organization_id) {
	 * this.organization_id = organization_id; }
	 */
		


}
