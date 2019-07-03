package jbr.springmvc.dao;

import java.util.List;

import jbr.springmvc.model.SponsorEntity;

public interface SponsorDao {

	
	public void addSponsor (SponsorEntity sponsor);
	
	public List<SponsorEntity> getSponsors(int hackathon_id, int orgnization_id);
	
	public List<SponsorEntity> getHackathonSponsors(int id);
	
}
