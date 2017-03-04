package database.dao;

import java.util.List;

import main.model.Review;

public interface ReviewDAO {
	
	public void create(Review review);
    
    public List<Review> getAllReview();
     
    public Review readByDocument(String id, String approverId);
     
    public Review readByReviewId(String id);
     
    public int deleteByReviewId(String id);
    
    public int deleteByDocumentId(String id);

}
