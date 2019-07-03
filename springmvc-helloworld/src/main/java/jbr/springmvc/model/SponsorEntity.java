package jbr.springmvc.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="sponsor")
public class SponsorEntity {
	@Id
	@GeneratedValue
	private Integer id;
	
	private Integer hackathon_id;
	
	private Integer organization_id;

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

	public Integer getOrganization_id() {
		return organization_id;
	}

	public void setOrganization_id(Integer organization_id) {
		this.organization_id = organization_id;
	}
}
