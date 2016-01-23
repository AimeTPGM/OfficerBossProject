package mongodb.main;

import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.mongodb.MongoClient;

import main.model.User;
import main.rest.userstatus.Boss;
import main.rest.userstatus.Officer;
import mongodb.dao.UserDAO;

public class MongoDBMain {
	 
    public static final String DB_NAME = "usertest";
    public static final String USER_COLLECTION = "usertestonly";
    public static final String MONGO_HOST = "localhost";
    public static final int MONGO_PORT = 27017;
    private static MongoClient mongo;
 
    public static void run() {
    	try {
        	System.out.println("connecting to mongodb at"+MONGO_HOST+":"+MONGO_PORT+"...\ndatabase name: "+DB_NAME+"\ncollection: "+USER_COLLECTION);
            mongo = new MongoClient(
                    MONGO_HOST, MONGO_PORT);
            System.out.println("connected!");
             
        } catch (UnknownHostException e) {
        	System.err.println("Cannot connect to "+MONGO_HOST+":"+MONGO_PORT);
            e.printStackTrace();
        }
    }
    public static MongoClient getMongoClient(){
    	return mongo;
    }
 
}