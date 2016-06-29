package mongodb.dao;

import java.util.List;

import com.mongodb.BasicDBObject;

import main.model.User;
import main.rest.userstatus.Boss;

public interface UserDAO {
	 
    public void create(User user);
    
    public List<User> getAllUsers();
    
    public List<User> getUserByRole(String role);
     
    public User readById(String id);
     
    public void update(User user);
     
    public int deleteById(String id);

	public User readByEmail(String email);
}