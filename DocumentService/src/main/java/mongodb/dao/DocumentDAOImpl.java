package mongodb.dao;

import java.util.List;

import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.Mongo;
import com.mongodb.MongoClient;
import com.mongodb.WriteResult;

import main.model.Document;
import main.rest.documentstatus.DocumentStatus;
import mongodb.main.MongoDBMain;

public class DocumentDAOImpl implements DocumentDAO{
	private MongoOperations mongoOps;
	private static final String DB_NAME = "documenttest";
	private static final String DOCUMENT_COLLECTION = "documenttestonly";
	public static final MongoClient mongo = MongoDBMain.getMongoClient();
	private static final DB db = mongo.getDB(DB_NAME);

	public DocumentDAOImpl(MongoOperations mongoOps){
		this.mongoOps=mongoOps;
    }
	
	public void create(Document document) {
		System.out.println("Adding new document");
		this.mongoOps.insert(document, DOCUMENT_COLLECTION);
	}

	public List<Document> getAllDocuments() {
		return this.mongoOps.findAll(Document.class, DOCUMENT_COLLECTION);
	}


	public Document readById(String id) {
		Query query = new Query(Criteria.where("_id").is(id));
        return this.mongoOps.findOne(query, Document.class, DOCUMENT_COLLECTION);
	}

	public void update(Document document) {
//		BasicDBObject newDocument = new BasicDBObject();
//		newDocument.append("$set", new BasicDBObject().append("name", document.getDocumentName()));
//		newDocument.append("$set", new BasicDBObject().append("description", document.getDescription()));
//		newDocument.append("$set", new BasicDBObject().append("lastModifiedDate", document.getLastModifiedDate()));
//		newDocument.append("$set", new BasicDBObject().append("version", document.getVersion()));
//		newDocument.append("$set", new BasicDBObject().append("status", document.getDocumentStatus()));
//		
//		BasicDBObject searchQuery = new BasicDBObject().append("documentId", document.getDocumentId());
//		
//		DBCollection collection = db.getCollection(DOCUMENT_COLLECTION);
//		collection.update(searchQuery, newDocument);
//		this.mongoOps.save(document, DOCUMENT_COLLECTION);
		//TODO fixes bugs ... it does nothing 
		Query query = new Query(Criteria.where("_id").is(document.getDocumentId()));
		Update update = new Update();
		update.set("name", document.getDocumentName());
		update.set("description", document.getDescription());
		update.set("lastModifiedDate", document.getLastModifiedDate());
		update.set("version", document.getVersion());
		update.set("status", document.getDocumentStatus());
		
		this.mongoOps.findAndModify(query, update, Document.class, DOCUMENT_COLLECTION);
		
	}

	public int deleteById(String id) {
		Query query = new Query(Criteria.where("_id").is(id));
        WriteResult result = this.mongoOps.remove(query, Document.class, DOCUMENT_COLLECTION);
        return result.getN();
	}

}
