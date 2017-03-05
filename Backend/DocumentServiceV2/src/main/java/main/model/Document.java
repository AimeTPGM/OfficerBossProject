package main.model;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.springframework.data.annotation.Id;

import main.model.documentstatus.DocumentStatus;


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
	private int majorVersion;
	private int minorVersion;
	private boolean editable;
	
	public Document(){
		
	}
	public Document(String name, String description,Date createdDate, Date lastModifiedDate, String status, String creatorId, int majorVersion, int minorVersion, boolean editable){
		
		this.name = name;
		this.description = description;
		this.creatorId = creatorId;
		this.majorVersion = majorVersion;
		this.minorVersion = minorVersion;
		setVersion();
		setCreatedDate(createdDate);
		setLastModifiedDate(lastModifiedDate);
		this.status = status;
		this.editable = editable;
	}
	
	
	
	public Document(String documentId, String name, String description,String createdDate, String lastModifiedDate, String status, String creatorId, String approverId, String version, String editable){
		this.documentId = documentId;
		this.name = name;
		this.description = description;
		this.creatorId = creatorId;
		this.approverId = approverId;
		this.version = version;
		this.createdDate = createdDate;
		this.lastModifiedDate = lastModifiedDate;
		this.status = status;
	}
	
	public String getCreatorId() {
		return creatorId;
	}
	public void setCreatorId(String creatorId) {
		this.creatorId = creatorId;
	}
	public boolean isEditable() {
		return editable;
	}

	public void setEditable(boolean editable) {
		this.editable = editable;
	}

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
	public void setVersion(){
		this.version = majorVersion+"."+minorVersion;
	}
	public String getVersion(){
		return majorVersion+"."+minorVersion;
	}
	public int getMajorVersion() {
		return majorVersion;
	}


	public void setMajorVersion(int majorVersion) {
		this.majorVersion = majorVersion;
	}


	public int getMinorVersion() {
		return minorVersion;
	}


	public void setMinorVersion(int minorVersion) {
		this.minorVersion = minorVersion;
	}

	public String getApproverId() {
		return approverId;
	}

	public void setApproverId(String approverId) {
		this.approverId = approverId;
	}
	
	public String toString(){
		return "id: "+this.documentId+
				"\nname: "+this.name+
				"\ndesc: "+this.description+
				"\nstatus: "+this.status+
				"\ncreated date: "+this.createdDate+
				"\nlast modified: "+this.lastModifiedDate+
				"\nversion: "+this.version+
				"\ncreator id: "+this.creatorId+
				"\napprover id: "+this.approverId+
				"\neditable: "+this.editable;
	}

}
