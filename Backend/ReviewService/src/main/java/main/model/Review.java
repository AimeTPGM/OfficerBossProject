package main.model;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.springframework.data.annotation.Id;

public class Review {
	@Id
	private String reviewId;
	private String documentId;
	private String approverId;
	private String reviewDesc;
	private String reviewDate;
	
	public Review(){
		
	}
	
	public Review(String documentId, String approverId, String reviewDesc, Date date){
		this.documentId = documentId;
		this.approverId = approverId;
		this.reviewDesc = reviewDesc;
		setReviewDate(date);
	}
	
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
	public void setReviewDate(Date date){
		DateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
		this.reviewDate = dateFormat.format(date);
	}
	public String getReviewDate(){
		return this.reviewDate;
	}

}
