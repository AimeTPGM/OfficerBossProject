package main.model.folderstatus;

public class InProgress implements FolderStatus{
	private String documentStatusName = "In Progress";
	
	public String getFolderStatusName(){
		return documentStatusName;
		
	}
	
}
