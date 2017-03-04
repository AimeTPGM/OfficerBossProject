package main.rest;

import java.util.Date;
import java.util.List;

import javax.inject.Inject;
import javax.inject.Named;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.springframework.context.ApplicationContext;
import org.springframework.web.client.RestTemplate;

import database.dao.ReviewDAO;
import main.Application;
import main.model.Review;

@Named
@Path("/")
public class ReviewRest {
	private Review review;
	private List<Review> reviews;
	private ApplicationContext ctx = Application.database.getContext();
	private ReviewDAO reviewDAO = ctx.getBean("reviewDAO", ReviewDAO.class);
	
	@Inject
	private RestTemplate restTemplate;
	
	public Response okStatus(Object obj){
		return Response.status(200).entity(obj).build();
	}
	
	@GET
	@Path("getReviewByDocumentId")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getReviewByDocumentId(@QueryParam("documentId") String id, @QueryParam("approverId") String approverId) {
		System.out.println("GET request : get review by document");
		review = reviewDAO.readByDocument(id, approverId);
		System.out.println("GET request : return review");
		return okStatus(review);
	}
	
	@GET
	@Path("getReviews")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getReviews() {
		reviews = reviewDAO.getAllReview();
		return okStatus(reviews);
	}
	
	@GET
	@Path("getReview")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getReview(@QueryParam("reviewId") String id) {
		review = reviewDAO.readByReviewId(id);
		return okStatus(review);
	}
	
	public Response getNoReview(){
		return okStatus("No commment from approver yet");
	}
	
	@GET
	@Path("deleteById")
	public Response deleteById(@QueryParam("id") String id){
		reviewDAO.deleteByReviewId(id);
		return okStatus("Deleted!");
	}
	
	@GET
	@Path("deleteByDocumentId")
	public Response deleteByDocumentId(@QueryParam("documentId") String documentId){
		reviewDAO.deleteByDocumentId(documentId);
		return okStatus("Deleted!");
	}
	
	
	@GET
	@Path("approve")
	@Produces(MediaType.APPLICATION_JSON)
	public Response approve(
			@QueryParam("documentId") String documentId,
			@QueryParam("approverId") String approverId,
			@QueryParam("reviewDesc") String reviewDesc) {

		review = new Review(documentId, approverId, reviewDesc, new Date(), "Approved");
		reviewDAO.create(review);
		return okStatus(review);
	}
	
	@GET
	@Path("reject")
	@Produces(MediaType.APPLICATION_JSON)
	public Response reject(
			@QueryParam("documentId") String documentId,
			@QueryParam("approverId") String approverId,
			@QueryParam("reviewDesc") String reviewDesc) {

		review = new Review(documentId, approverId, reviewDesc, new Date(), "Rejected");
		reviewDAO.create(review);
		return okStatus(review);
	}
	

}
