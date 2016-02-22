package mongodb.dao;

import java.util.List;

import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import com.mongodb.MongoClient;
import com.mongodb.WriteResult;

import main.model.PublishDocument;
import mongodb.main.MongoDBMain;

public class PublishDocumentDAOImpl implements PublishDocumentDAO{
	private MongoOperations mongoOps;
	private static final String COLLECTION = MongoDBMain.getCollection();
	public static final MongoClient mongo = MongoDBMain.getMongoClient();
	
	public PublishDocumentDAOImpl(MongoOperations mongoOps){
		this.mongoOps=mongoOps;
	}

	public List<PublishDocument> getPublishDocumentList() {
		System.out.println("DAO: Return all publish documents");
		return this.mongoOps.findAll(PublishDocument.class, COLLECTION);
	}

	public void create(PublishDocument publishDocument) {
		System.out.println("DAO: Adding new publish documents");
		this.mongoOps.insert(publishDocument, COLLECTION);
		System.out.println("DAO: Added!");
		
	}

	public void update(PublishDocument publishDocument) {
		// TODO Auto-generated method stub
		
	}

	public void delete(String id) {
		System.out.println("DAO: Querying publish documents id:"+id);
		Query query = new Query(Criteria.where("_id").is(id));
		System.out.println("DAO: Deleting publish documents id:"+id);
        WriteResult result = this.mongoOps.remove(query, PublishDocument.class, COLLECTION);
        System.out.println("DAO: Deleted!");
		
	}

	public PublishDocument readById(String id) {
		System.out.println("DAO: Querying publish documents id:"+id);
		Query query = new Query(Criteria.where("_id").is(id));
		System.out.println("DAO: Return publish documents");
		return this.mongoOps.findOne(query, PublishDocument.class, COLLECTION);
		
	}

}
