package main.model;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import main.model.folderstatus.FolderStatus;


public class Folder {
	private String id;
	private String folderName;
	private List<String> documentIdList;
	private String lastUpdate;
	private String folderStatus;
	private String numberOfDocument;
	
	public Folder(){
		documentIdList = new ArrayList<String>();
	}
	
	public void setId(String id){
		this.id = id;
	}
	
	public String getId(){
		return this.id;
	}
	
	public void setDocumentList(List<String> documentList){
		this.documentIdList = documentList;
	}
	
	public List<String> getDocumentList(){
		return this.documentIdList;
	}
	public void addDocument(String document){
		documentIdList.add(document);
		setNumberOfDocument(documentIdList.size());
	}
	
	public void setNumberOfDocument(int numberOfDocument){
		this.numberOfDocument = numberOfDocument+"";
	}
	
	public String getNumberOfDocuments(){
		return numberOfDocument;
	}
	
	public void setLastUpdate(Date date){
		DateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
		this.lastUpdate = dateFormat.format(date);
	}
	public String getLastUpdate(){
		return lastUpdate;
	}
	public void setFolderStatus(FolderStatus folderStatus){
		this.folderStatus = folderStatus.getFolderStatusName();
	}
	public String getFolderStatus(){
		return this.folderStatus;
	}
	public void setFolderName(String folderName){
		this.folderName = folderName;
	}
	public String getFolderName(){
		return this.folderName;
	}
	

}
