package mongodb.main;

import java.net.UnknownHostException;
import com.mongodb.MongoClient;


public class MongoDBMain {
	 
    private static final String DB_NAME = "reviewtest";
    private static final String REVIEW_COLLECTION = "reviewtestonly";
    private static final String APPROVER_LIST_COLLECTION = "approverlisttestonly";
    private static final String MONGO_HOST = "localhost";
    private static final int MONGO_PORT = 27019;
    private static MongoClient mongo;
 
    public static void run() {
        try {
        	System.out.println("connecting to mongodb at "+MONGO_HOST+":"+MONGO_PORT+"...\ndatabase name: "+DB_NAME+"\ncollection: "+REVIEW_COLLECTION+" and "+APPROVER_LIST_COLLECTION);
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
    public static String getDBName(){
    	return DB_NAME;
    }
    public static String getReviewCollection(){
    	return REVIEW_COLLECTION;
    }
    public static String getApproverListCollection(){
    	return APPROVER_LIST_COLLECTION;
    }
    public static String getHost(){
    	return MONGO_HOST;
    }
    public static int getPort(){
    	return MONGO_PORT;
    }
}