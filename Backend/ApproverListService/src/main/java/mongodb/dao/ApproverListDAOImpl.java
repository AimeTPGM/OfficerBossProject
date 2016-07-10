package mongodb.dao;

import java.util.List;

import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

import com.mongodb.MongoClient;
import com.mongodb.WriteResult;

import main.model.ApproverList;
import mongodb.main.MongoDBMain;

public class ApproverListDAOImpl implements ApproverListDAO{
	private MongoOperations mongoOps;
	private static final String COLLECTION = MongoDBMain.getCollection();
	public static final MongoClient mongo = MongoDBMain.getMongoClient();
	
	public ApproverListDAOImpl(MongoOperations mongoOps){
		this.mongoOps=mongoOps;
	}

	public List<ApproverList> getApproverLists() {
		System.out.println("DAO: Return all approver lists");
		return this.mongoOps.findAll(ApproverList.class, COLLECTION);
	}

	public void create(ApproverList approver) {
		System.out.println("DAO: Adding a new approver list");
		this.mongoOps.insert(approver, COLLECTION);
		System.out.println("DAO: Added!");
		
	}

	public void update(String documentId, ApproverList approverIdList) {
		System.out.println("DAO: Querying document id:"+documentId);
		Query query = new Query(Criteria.where("documentId").is(documentId));
		Update update = new Update();
		update.set("approverIdList", approverIdList.getApproverIdList());
		update.set("currentApproverIdIndex", approverIdList.getCurrentApproverIdIndex());
		System.out.println("DAO: Updating document id:"+documentId);
		this.mongoOps.findAndModify(query, update, ApproverList.class, COLLECTION);
		
	}

	public void delete(String id) {
		System.out.println("DAO: Querying approver lists id:"+id);
		Query query = new Query(Criteria.where("_id").is(id));
		System.out.println("DAO: Deleting approver lists id:"+id);
        WriteResult result = this.mongoOps.remove(query, ApproverList.class, COLLECTION);
        System.out.println("DAO: Deleted!");
		
	}
	
	public void deleteByDocuumentId(String documentId) {
		System.out.println("DAO: Querying document id:"+documentId);
		Query query = new Query(Criteria.where("documentId").is(documentId));
		System.out.println("DAO: Deleting document id:"+documentId);
        WriteResult result = this.mongoOps.remove(query, ApproverList.class, COLLECTION);
        System.out.println("DAO: Deleted!");
		
	}

	public ApproverList readById(String id) {
		System.out.println("DAO: Querying approver lists id:"+id);
		Query query = new Query(Criteria.where("_id").is(id));
		System.out.println("DAO: Return approver list");
		return this.mongoOps.findOne(query, ApproverList.class, COLLECTION);
		
	}
	
	public ApproverList readByDocumentId(String id) {
		System.out.println("DAO: Querying approver list in document id:"+id);
		Query query = new Query(Criteria.where("documentId").is(id));
		System.out.println("DAO: Return approver list");
		return this.mongoOps.findOne(query, ApproverList.class, COLLECTION);
		
	}

	public void deleteByDocumentId(String id) {
		// TODO Auto-generated method stub
		
	}

}
