package mongodb.dao;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.MongoClient;
import com.mongodb.WriteResult;

import main.model.Document;
import mongodb.main.MongoDBMain;

public class DocumentDAOImpl implements DocumentDAO{
	private static MongoOperations mongoOps;
	private static final String COLLECTION = MongoDBMain.getDocumentCollection();
	private static MongoClient mongo = MongoDBMain.getMongoClient();
	private static final DB db = mongo.getDB(MongoDBMain.getDBName());
	private static final DBCollection docCollection = db.getCollection(COLLECTION);
	
	
	public DocumentDAOImpl(MongoOperations mongoOps){
		if (this.mongoOps == null){
			this.mongoOps=mongoOps;
		}
    }
	
	public List<String> create(Document document) {
//		MongoDBMain.run();
		System.out.println("DAO: Adding new document");
		BasicDBObject doc = new BasicDBObject();
		doc.put("name", document.getDocumentName());
		doc.put("description", document.getDescription());
		doc.put("status", document.getDocumentStatus());
		doc.put("creatorId", document.getCreatorId());
		doc.put("approverId", document.getApproverId());
		doc.put("createdDate", document.getCreatedDate());
		doc.put("lastModifiedDate", document.getLastModifiedDate());
		doc.put("version", document.getVersion());
		doc.put("majorVersion", document.getMajorVersion());
		doc.put("minorVersion", document.getMinorVersion());
		doc.put("editable", document.isEditable());
		
		docCollection.insert(doc);
		System.out.println("DAO: Added!");
//		MongoDBMain.mongo.close();
		
		List<String> response = new ArrayList<String>();
		response.add(doc.getObjectId("_id").toString());
		response.add(doc.toJson());
		
		return response;
	}

	public List<Document> getAllDocuments() {
//		MongoDBMain.run();
		System.out.println("DAO: Return all documents");
		List<Document> result = this.mongoOps.findAll(Document.class, COLLECTION);
//		MongoDBMain.mongo.close();
		return result;
	}


	public Document readById(String id) {
//		MongoDBMain.run();
		System.out.println("DAO: Querying document id:"+id);
		Query query = new Query(Criteria.where("_id").is(id));
		System.out.println("DAO: Return document id:"+id);
		Document result = this.mongoOps.findOne(query, Document.class, COLLECTION);
//		MongoDBMain.mongo.close();
        return result;
	}

	public void update(Document document) {
//		MongoDBMain.run();
		System.out.println("DAO: Querying document id:"+document.getDocumentId());
		Query query = new Query(Criteria.where("_id").is(document.getDocumentId()));
		Update update = new Update();
		update.set("name", document.getDocumentName());
		update.set("description", document.getDescription());
		update.set("status", document.getDocumentStatus());
		update.set("approverId", document.getApproverId());
		update.set("lastModifiedDate", document.getLastModifiedDate());
		update.set("version", document.getVersion());
		update.set("majorVersion", document.getMajorVersion());
		update.set("minorVersion", document.getMinorVersion());
		update.set("editable", document.isEditable());
		
		System.out.println("DAO: Updating document id:"+document.getDocumentId());
		this.mongoOps.findAndModify(query, update, Document.class, COLLECTION);
//		MongoDBMain.mongo.close();
		
	}

	public int deleteById(String id) {
//		MongoDBMain.run();
		System.out.println("DAO: Querying document id:"+id);
		Query query = new Query(Criteria.where("_id").is(id));
		System.out.println("DAO: Deleting document id:"+id);
        WriteResult result = this.mongoOps.remove(query, Document.class, COLLECTION);
        System.out.println("DAO: Deleted!");
//        MongoDBMain.mongo.close();
        return result.getN();
	}

	public List<Document> getAllDocumentsByUserId(String id) {
//		MongoDBMain.run();
		Query query = new Query();
		query.addCriteria(Criteria.where("creatorId").is(id));
		System.out.println("DAO: Return documents");
		List<Document> result = this.mongoOps.find(query, Document.class, COLLECTION);
//		MongoDBMain.mongo.close();
		return result;
	}
	
	public List<Document> getAllDocumentsByApproverId(String id) {
//		MongoDBMain.run();
		Query query = new Query();
		query.addCriteria(Criteria.where("approverId").is(id));
		System.out.println("DAO: Return documents");
		List<Document> result = this.mongoOps.find(query, Document.class, COLLECTION);
//		MongoDBMain.mongo.close();
		return result;
	}

}
