package database.mongodb;

import java.util.List;

import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import com.mongodb.MongoClient;
import com.mongodb.WriteResult;

import database.dao.ReviewDAO;
import main.model.Review;

public class ReviewDAOImpl implements ReviewDAO{
	private MongoOperations mongoOps;
	private static final String COLLECTION = MongoDBMain.getCollection();
	public static final MongoClient mongo = MongoDBMain.getMongoClient();
	
	public ReviewDAOImpl(MongoOperations mongoOps){
		this.mongoOps=mongoOps;
    }
	public void create(Review review) {
		System.out.println("DAO: Adding new review");
		this.mongoOps.insert(review, COLLECTION);
		System.out.println("DAO: Added!");
		
	}

	public List<Review> getAllReview() {
		System.out.println("DAO: Return all reviews");
		return this.mongoOps.findAll(Review.class, COLLECTION);
	}

	public Review readByDocument(String id,String approverId) {
		System.out.println("DAO: Querying review by document id:"+id);
		Query query = new Query();
		query.addCriteria(Criteria.where("documentId").is(id)
				.andOperator(Criteria.where("approverId").is(approverId)));
		
		System.out.println("DAO: Return review");
		return this.mongoOps.findOne(query, Review.class, COLLECTION);
	}
	
	public Review readByReviewId(String id) {
		System.out.println("DAO: Querying review id:"+id);
		Query query = new Query(Criteria.where("_id").is(id));
		System.out.println("DAO: Return review");
		return this.mongoOps.findOne(query, Review.class, COLLECTION);
	}

	public int deleteByReviewId(String id) {
		System.out.println("DAO: Querying review id:"+id);
		Query query = new Query(Criteria.where("_id").is(id));
		System.out.println("DAO: Deleting review id:"+id);
        WriteResult result = this.mongoOps.remove(query, Review.class, COLLECTION);
        System.out.println("DAO: Deleted!");
        return result.getN();
	}

	public int deleteByDocumentId(String id) {
		System.out.println("DAO: Querying review id:"+id);
		Query query = new Query(Criteria.where("documentId").is(id));
		System.out.println("DAO: Deleting review id:"+id);
        List<Review> result = this.mongoOps.findAllAndRemove(query, Review.class, COLLECTION);
        System.out.println("DAO: Deleted!");
        return result.size();
	}

}
