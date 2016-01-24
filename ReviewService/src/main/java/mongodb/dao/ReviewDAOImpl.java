package mongodb.dao;

import java.util.List;

import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import com.mongodb.MongoClient;
import com.mongodb.WriteResult;

import main.model.Review;
import mongodb.main.MongoDBMain;

public class ReviewDAOImpl implements ReviewDAO{
	private MongoOperations mongoOps;
	private static final String REVIEW_COLLECTION = MongoDBMain.getCollection();
	public static final MongoClient mongo = MongoDBMain.getMongoClient();
	
	public ReviewDAOImpl(MongoOperations mongoOps){
		this.mongoOps=mongoOps;
    }
	public void create(Review review) {
		System.out.println("DAO: Adding new review");
		this.mongoOps.insert(review, REVIEW_COLLECTION);
		System.out.println("DAO: Added!");
		
	}

	public List<Review> getAllReview() {
		System.out.println("DAO: Return all reviews");
		return this.mongoOps.findAll(Review.class, REVIEW_COLLECTION);
	}

	public Review readByDocumentId(String id) {
		System.out.println("DAO: Querying review by document id:"+id);
		Query query = new Query(Criteria.where("documentId").is(id));
		System.out.println("DAO: Return review");
		return this.mongoOps.findOne(query, Review.class, REVIEW_COLLECTION);
	}
	
	public Review readByReviewId(String id) {
		System.out.println("DAO: Querying review id:"+id);
		Query query = new Query(Criteria.where("_id").is(id));
		System.out.println("DAO: Return review");
		return this.mongoOps.findOne(query, Review.class, REVIEW_COLLECTION);
	}

	public void update(Review review) {
		// TODO Do an update on review <-- go fix document update bug first!
		
	}

	public int deleteByReviewId(String id) {
		System.out.println("DAO: Querying review id:"+id);
		Query query = new Query(Criteria.where("_id").is(id));
		System.out.println("DAO: Deleting review id:"+id);
        WriteResult result = this.mongoOps.remove(query, Review.class, REVIEW_COLLECTION);
        System.out.println("DAO: Deleted!");
        return result.getN();
	}

	public int deleteByDocumentId(String id) {
		System.out.println("DAO: Querying review id:"+id);
		Query query = new Query(Criteria.where("documentId").is(id));
		System.out.println("DAO: Deleting review id:"+id);
        WriteResult result = this.mongoOps.remove(query, Review.class, REVIEW_COLLECTION);
        System.out.println("DAO: Deleted!");
        return result.getN();
	}

}
