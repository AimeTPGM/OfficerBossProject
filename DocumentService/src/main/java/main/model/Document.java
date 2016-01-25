package main.model;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.springframework.data.annotation.Id;


public class Document {
	
	@Id 
	private String documentId;
	private String name;
	private String description;
	private String status;
	private String createdDate;
	private String lastModifiedDate;
	private String version;
	private String creatorId;
	private String approverId;
	
	public void setDocumentId(String id){
		documentId = id;
	}
	public String getDocumentId(){
		return documentId;
	}
	public void setDocumentName(String name){
		this.name = name;
	}
	public String getDocumentName(){
		return name;
	}
	public void setDescription(String desc){
		this.description = desc;
	}
	public String getDescription(){
		return description;
	}
	public void setDocumentStatus(String status){
		this.status = status;
	}
	public String getDocumentStatus(){
		return this.status;
	}
	public void setCreatedDate(Date date){
		DateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
		this.createdDate = dateFormat.format(date);
	}
	public String getCreatedDate(){
		return createdDate;
	}
	public void setLastModifiedDate(Date date){
		DateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
		this.lastModifiedDate = dateFormat.format(date);
	}
	public String getLastModifiedDate(){
		return lastModifiedDate;
	}
	public void setVersion(Double version){
		this.version = version+"";
	}
	public String getVersion(){
		return version;
	}
	public void setCreator(String creatorId){
		this.creatorId = creatorId;
	}
	public String getCreator(){
		return creatorId;
	}
	public void setApprover(String approverId){
		this.approverId = approverId;
	}
	public String getApprover(){
		return approverId;
	}

}
