package main.model;

import org.springframework.data.annotation.Id;

import main.rest.userstatus.UserStatus;

public class User {
	
	//id will be used for storing MongoDB _id
    @Id 
    private String id;
    
	private String firstname;
	private String lastname;
	private String email;
	private String password;
	private UserStatus status;
	
	public User(){
		
	}
	
	public User(String firstname, String lastname, String email, String password, UserStatus userstatus){
		this.firstname = firstname;
		this.lastname = lastname;
		this.email = email;
		this.password = password;
		this.status = userstatus;
	}
	
	public void setUserId(String id){
		this.id = id;
	}
	public String getUserId(){
		return id;
	}
	public void setFirstname(String firstname){
		this.firstname = firstname;
	}
	public String getFirstname(){
		return firstname;
	}
	public void setLastname(String lastname){
		this.lastname = lastname;
	}
	public String getLastname(){
		return lastname;
	}
	public void setEmail(String email){
		this.email = email;
	}
	public String getEmail(){
		return email;
	}
	public void setUserStatus(UserStatus status){
		this.status = status;
	}
	public String getUserStatus(){
		return this.status.getUserStatusName();
	}
	//TODO Do an authorization with password encryption
	public void setPassword(String password){
		this.password = password;
	}
	public String getPasssword(){
		return this.password;
	}

}
