package mongodb.main;

import java.net.UnknownHostException;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import com.mongodb.MongoClient;


public class MongoDBMain {
	 
    private static final String DB_NAME = "documenttest";
    private static final String DOCUMENT_COLLECTION = "documenttestonly";
    private static final String FOLDER_COLLECTION = "foldertestonly";
    private static final String MONGO_HOST = "localhost";
    private static final int MONGO_PORT = 27040;
    private static MongoClient mongo;
    private static ApplicationContext ctx = null;
 
    public static void run(){
        mongo = new MongoClient(
		        MONGO_HOST, MONGO_PORT);
        
		System.out.println("connected!");
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
    
    public static ApplicationContext getContext(){
    	if (ctx == null){
    		ctx = new ClassPathXmlApplicationContext("spring.xml");
    	}
    	return ctx;
    }
 
}