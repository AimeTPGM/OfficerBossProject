package mongodb.dao;

import java.util.List;

import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

import com.mongodb.MongoClient;
import com.mongodb.WriteResult;

import main.model.Document;
import mongodb.main.MongoDBMain;

public class DocumentDAOImpl implements DocumentDAO{
	private MongoOperations mongoOps;
	private static final String COLLECTION = MongoDBMain.getCollection();
	public static final MongoClient mongo = MongoDBMain.getMongoClient();

	public DocumentDAOImpl(MongoOperations mongoOps){
		this.mongoOps=mongoOps;
    }
	
	public void create(Document document) {
		System.out.println("DAO: Adding new document");
		this.mongoOps.insert(document, COLLECTION);
		System.out.println("DAO: Added!");
	}

	public List<Document> getAllDocuments() {
		System.out.println("DAO: Return all documents");
		return this.mongoOps.findAll(Document.class, COLLECTION);
	}


	public Document readById(String id) {
		System.out.println("DAO: Querying document id:"+id);
		Query query = new Query(Criteria.where("_id").is(id));
		System.out.println("DAO: Return document id:"+id);
        return this.mongoOps.findOne(query, Document.class, COLLECTION);
	}

	public void update(Document document) {
		System.out.println("DAO: Querying document id:"+document.getDocumentId());
		Query query = new Query(Criteria.where("_id").is(document.getDocumentId()));
		Update update = new Update();
		update.set("name", document.getDocumentName());
		update.set("description", document.getDescription());
		update.set("lastModifiedDate", document.getLastModifiedDate());
		update.set("version", document.getVersion());
		update.set("status", document.getDocumentStatus());
		System.out.println("DAO: Updating document id:"+document.getDocumentId());
		this.mongoOps.findAndModify(query, update, Document.class, COLLECTION);
		
	}

	public int deleteById(String id) {
		System.out.println("DAO: Querying document id:"+id);
		Query query = new Query(Criteria.where("_id").is(id));
		System.out.println("DAO: Deleting document id:"+id);
        WriteResult result = this.mongoOps.remove(query, Document.class, COLLECTION);
        System.out.println("DAO: Deleted!");
        return result.getN();
	}

	public List<Document> getAllDocumentsByUserId(String id) {
		Query query = new Query();
		query.addCriteria(Criteria.where("creatorId").is(id));
		System.out.println("DAO: Return documents");
		return mongoOps.find(query, Document.class, COLLECTION);
	}

}
