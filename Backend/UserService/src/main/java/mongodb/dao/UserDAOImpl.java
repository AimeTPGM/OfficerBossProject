package mongodb.dao;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import com.mongodb.BasicDBObject;
import com.mongodb.WriteResult;

import main.model.User;

public class UserDAOImpl implements UserDAO{
	private MongoOperations mongoOps;
	private static final String COLLECTION = "usertestonly";
	
	public UserDAOImpl(MongoOperations mongoOps){
        this.mongoOps=mongoOps;
    }
	
	public void create(User user) {
		// TODO Auto-generated method stub
		this.mongoOps.insert(user, COLLECTION);
	}
	
	public List<User> getAllUsers(){
		return this.mongoOps.findAll(User.class, COLLECTION);
	}
	
	public List<BasicDBObject> getUserByRole(String role){
		List<BasicDBObject> obj = new ArrayList<BasicDBObject>();
		obj.add(new BasicDBObject("status", role));
        return obj;
	}

	public User readById(String id) {
		// TODO Auto-generated method stub
		Query query = new Query(Criteria.where("_id").is(id));
        return this.mongoOps.findOne(query, User.class, COLLECTION);
		
	}

	public void update(User user) {
		// TODO Auto-generated method stub
		this.mongoOps.save(user, COLLECTION);
		
	}

	public int deleteById(String id) {
		// TODO Auto-generated method stub
		Query query = new Query(Criteria.where("_id").is(id));
        WriteResult result = this.mongoOps.remove(query, User.class, COLLECTION);
        return result.getN();
	}

}
