package mongodb.dao;



import java.util.List;

import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import com.mongodb.MongoClient;
import com.mongodb.WriteResult;

import main.model.User;
import main.rest.userstatus.Boss;
import main.rest.userstatus.Officer;
import mongodb.main.*;

public class UserDAOImpl implements UserDAO{
	private MongoOperations mongoOps;
	private static final String COLLECTION = "usertestonly";
	
	public UserDAOImpl(MongoOperations mongoOps){
        this.mongoOps=mongoOps;
    }
	
	public void create(User user) {
		System.out.println("DAO: Adding new user");
		this.mongoOps.insert(user, COLLECTION);
		System.out.println("DAO: Added!");

	}
	
	public List<User> getAllUsers(){
		System.out.println("DAO: Return all users");
	
		return this.mongoOps.findAll(User.class, COLLECTION);
		
	}
	
	public List<User> getUserByRole(String role){
		Query query = new Query();
		if(role.equals("Boss")){
			System.out.println("DAO: Querying all bosses");
			query.addCriteria(Criteria.where("status").is(new Boss()));
			System.out.println("DAO: Return all bosses");
		}
		else if(role.equals("Officer")){
			System.out.println("DAO: Querying all officers");
			query.addCriteria(Criteria.where("status").is(new Officer()));
			System.out.println("DAO: Return all officers");
		}
		

		return mongoOps.find(query, User.class, COLLECTION);
		
	}

	public User readById(String id) {
		System.out.println("DAO: Querying user by id:"+id);
		Query query = new Query(Criteria.where("_id").is(id));
		System.out.println("DAO: user found!");

        return this.mongoOps.findOne(query, User.class, COLLECTION);
		
	}
	
	public User readByEmail(String email) {
		System.out.println("DAO: Querying user by email:"+email);
		Query query = new Query(Criteria.where("email").is(email));
		System.out.println("DAO: user found!");
		
        return this.mongoOps.findOne(query, User.class, COLLECTION);
		
	}

	public void update(User user) {
		// TODO do update user profile
		this.mongoOps.save(user, COLLECTION);
		mongodb.main.MongoDBMain.close();
	}

	public int deleteById(String id) {
		System.out.println("DAO: Querying user id:"+id);
		Query query = new Query(Criteria.where("_id").is(id));
		System.out.println("DAO: Deleting user id:"+id);
        WriteResult result = this.mongoOps.remove(query, User.class, COLLECTION);
        System.out.println("DAO: Deleted!");
    
        return result.getN();
	}

}
