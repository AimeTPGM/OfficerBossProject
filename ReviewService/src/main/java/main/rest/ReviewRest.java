package main.rest;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.web.client.RestTemplate;

import main.model.Review;
import mongodb.dao.ReviewDAO;

public class ReviewRest {
	private Review review;
	private List<Review> reviews = new ArrayList<Review>();
	private Date date;
	private ClassPathXmlApplicationContext ctx = new ClassPathXmlApplicationContext("spring.xml");
	private ReviewDAO reviewDAO = ctx.getBean("reviewDAO", ReviewDAO.class);
	
	@Inject
	private RestTemplate restTemplate;
	
	
	@GET
	@Path("getreviewbydocumentid")
	@Produces(MediaType.APPLICATION_JSON)
	public String getReviewByDocumentId(@QueryParam("documentid") String id) {
		review = reviewDAO.readByDocumentId(id);
		return review.getReviewDesc();
	}
	
	@GET
	@Path("getreviews")
	@Produces(MediaType.APPLICATION_JSON)
	public List<Review> getReviews() {
		review = new Review();
		return reviewDAO.getAllReview();
	}
	
	@GET
	@Path("getreview")
	@Produces(MediaType.APPLICATION_JSON)
	public Review getReview(@QueryParam("reviewid") String id) {
		return reviewDAO.readByReviewId(id);
	}
	
	@GET
	@Path("createreview")
	@Produces(MediaType.APPLICATION_JSON)
	public Review createReview(
			@QueryParam("documentid") String id,
			@QueryParam("approverid") String approverId,
			@QueryParam("reviewdesc") String desc) {
		review = new Review();
		review.setDocumentId(id);
		review.setApproverId(approverId);
		review.setReviewDesc(desc);
		review.setReviewDate(date);
		reviewDAO.create(review);
		return review;
	}
	

}
