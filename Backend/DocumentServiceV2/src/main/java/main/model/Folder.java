package main.model;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;


public class Folder {
	private String id;
	private String folderName;
	private List<String> documentIdList;
	private String lastUpdate;
	private String numberOfDocument;
	private String creatorId;
	
	public Folder(){
		documentIdList = new ArrayList<String>();
	}
	
	public Folder(String folderName, Date date, String creatorId){
		setFolderName(folderName);
		setLastUpdate(date);
		setCreatorId(creatorId);
		documentIdList = new ArrayList<String>();
		setNumberOfDocument(documentIdList.size());
		
	}
	
	public Folder(List<String> documentIdList, String folderName, Date date, String creatorId){
		setFolderName(folderName);
		setLastUpdate(date);
		setCreatorId(creatorId);
		this.documentIdList = documentIdList;
		setNumberOfDocument(documentIdList.size());
		
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
	public void setFolderName(String folderName){
		this.folderName = folderName;
	}
	public String getFolderName(){
		return this.folderName;
	}
	
	public void setCreatorId(String creatorId){
		this.creatorId = creatorId;
	}
	
	public String getCreatorId(){
		return this.creatorId;
	}

	public String toString(){
		String temp = "";
		for (int i = 0; i < documentIdList.size(); i++) {
			if(i == documentIdList.size()-1) temp += documentIdList.get(i);
			else temp += documentIdList.get(i)+", ";
			
		}
		return "id: "+this.id+
				"\nname: "+this.folderName+
				"\nlastUpdate: "+this.lastUpdate+
				"\ncreatorId: "+this.creatorId+
				"\nno. of doc: "+this.numberOfDocument+
				"\ndoclist: "+temp;
	}
}
