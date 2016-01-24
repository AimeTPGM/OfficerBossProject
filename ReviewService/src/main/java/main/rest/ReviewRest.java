package main.rest;

import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.springframework.web.client.RestTemplate;

import main.model.Review;


public class ReviewRest {
	private Review review;
	private List<Review> reviews = new ArrayList<Review>();
	//TODO Beans and DAO
	
	@Inject
	private RestTemplate restTemplate;
	
	
	@GET
	@Path("getreviewbydocumentid")
	@Produces(MediaType.APPLICATION_JSON)
	public String getReviewByDocumentId(@QueryParam("documentid") String id) {
		review = new Review();
		//TO DO DAO.readByDocumentId
		
		return review.getReviewDesc();
	}
	
	@GET
	@Path("getreviews")
	@Produces(MediaType.APPLICATION_JSON)
	public List<Review> getReviews() {
		review = new Review();
		//TO DO DAO.getAll
		
		return reviews;
	}
	
	@GET
	@Path("getreview")
	@Produces(MediaType.APPLICATION_JSON)
	public Review getReview(@QueryParam("reviewid") String id) {
		review = new Review();
		//TO DO DAO.readByReviewId
		
		return review;
	}
	
	@GET
	@Path("createreview")
	@Produces(MediaType.APPLICATION_JSON)
	public Review createReview(
			@QueryParam("documentid") String id,
			@QueryParam("approverid") String approverId,
			@QueryParam("reviewDesc") String desc) {
		review = new Review();
		//TO DO DAO.create
		
		return review;
	}
	

}
