package main.model.folderstatus;

public class Unpublished implements FolderStatus{
	private String documentStatusName = "Unpublished";
	
	public String getFolderStatusName() {
		return documentStatusName;
		
	}
	
}
