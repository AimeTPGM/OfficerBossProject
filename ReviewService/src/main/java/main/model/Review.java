package main.model;

import org.springframework.data.annotation.Id;

public class Review {
	@Id
	private String reviewId;
	private String documentId;
	private String approverId;
	private String reviewDesc;
	
	public void setReviewId(String id){
		this.reviewId = id;
	}
	public String getReviewId(){
		return reviewId;
	}
	public void setDocumentId(String id){
		this.documentId = id;
	}
	public String getDocumentId(){
		return documentId;
	}
	public void setApproverId(String id){
		this.approverId = id;
	}
	public String getApproverId(){
		return approverId;
	}
	public void setReviewDesc(String desc){
		this.reviewDesc = desc;
	}
	public String getReviewDesc(){
		return reviewDesc;
	}

}
