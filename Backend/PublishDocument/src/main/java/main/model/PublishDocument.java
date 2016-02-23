package main.model;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.springframework.data.annotation.Id;

public class PublishDocument {
	@Id
	private String id;
	private String documentId;
	private String documentName;
	public String getDocumentName() {
		return documentName;
	}
	public void setDocumentName(String documentName) {
		this.documentName = documentName;
	}
	private String publishDate;
	public PublishDocument(){
		
	}
	public PublishDocument(String documentId, Date publishDate, String documentName){
		setDocumentId(documentId);
		setPublishDate(publishDate);
		setDocumentName(documentName);
	}
	public PublishDocument(String documentId){
		this.documentId = documentId;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getDocumentId() {
		return documentId;
	}
	public void setDocumentId(String documentId) {
		this.documentId = documentId;
	}
	public String getPublishDate() {
		return publishDate;
	}
	public void setPublishDate(Date date) {
		DateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
		this.publishDate = dateFormat.format(date);
	}
	
	

}
