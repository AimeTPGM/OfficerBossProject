package mongodb.dao;

import java.util.List;

import com.mongodb.BasicDBObject;

import main.model.User;

public interface UserDAO {
	 
    public void create(User user);
    
    public List<User> getAllUsers();
    
    public List<BasicDBObject> getUserByRole(String role);
     
    public User readById(String id);
     
    public void update(User user);
     
    public int deleteById(String id);
}