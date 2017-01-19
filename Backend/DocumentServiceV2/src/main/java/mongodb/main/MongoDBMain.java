package mongodb.main;

import java.net.UnknownHostException;

import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.MongoClient;
import com.mongodb.MongoClientOptions;
import com.mongodb.ReadPreference;


public class MongoDBMain {
	 
    private static final String DB_NAME = "documenttest";
    private static final String DOCUMENT_COLLECTION = "documenttestonly";
    private static final String FOLDER_COLLECTION = "foldertestonly";
    private static final String MONGO_HOST = "localhost";
    private static final int MONGO_PORT = 27018;
    private static MongoClient mongo;
    private static DB db;
 
    public static void run() {
        try {
//        	MongoClientOptions mco = new MongoClientOptions.Builder()
//    			    .connectionsPerHost(100)
//    			    .threadsAllowedToBlockForConnectionMultiplier(10)
//    			    .build();
//        	System.out.println("connecting to mongodb at"+MONGO_HOST+":"+MONGO_PORT+"...\ndatabase name: "+DB_NAME+"\ncollection: "+COLLECTION);
//            mongo = new MongoClient(MONGO_HOST+":"+MONGO_PORT, mco);
        	mongo = new MongoClient(
                    MONGO_HOST, MONGO_PORT);
        	db = mongo.getDB(DB_NAME);
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
    public static String getDocumentCollection(){
    	return DOCUMENT_COLLECTION;
    }
    public static String getFolderCollection(){
    	return FOLDER_COLLECTION;
    }
    public static String getHost(){
    	return MONGO_HOST;
    }
    public static int getPort(){
    	return MONGO_PORT;
    }
    public static DBCollection checkConnection(String collection){
    	if(db == null){
            try {
				db = (new MongoClient(
				        MONGO_HOST, MONGO_PORT)).getDB(DB_NAME);
			} catch (UnknownHostException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
        }
        return db.getCollection(collection);
    }
 
}