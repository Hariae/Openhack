package jbr.springmvc.dao;

import java.util.List;


import jbr.springmvc.model.UserEntity;

public interface UserDao {
	
	public List<UserEntity> getAllUsers();
	
	public void addUser(UserEntity user);
	
	public UserEntity getUser (String email);

	public void updateUser(UserEntity user);

	public UserEntity getUserbyId(Integer user_id);

	public List<UserEntity> getUsers(int hackathon_id);
	  
	public UserEntity getUserByScreenName(String screen_name);
}
