package main.model.folderstatus;

public class Empty implements FolderStatus{
	private String documentStatusName = "Empty";
	
	public String getFolderStatusName(){
		return documentStatusName;
		
	}
	
}
