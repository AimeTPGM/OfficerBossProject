package mongodb.dao;

import java.util.List;

import main.model.Review;

public interface ReviewDAO {
	
	public void create(Review review);
    
    public List<Review> getAllReview();
     
    public List<Review> readByDocumentId(String id);
     
    public Review readByReviewId(String id);
    
    public void update(Review review);
     
    public int deleteByReviewId(String id);
    
    public int deleteByDocumentId(String id);

}
