package main.model;

import java.util.ArrayList;
import java.util.List;


public class Folder {
	private String id;
	private List<String> documentIdList;
	
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
	}
	

}
