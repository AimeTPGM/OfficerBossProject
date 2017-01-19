package main.model.documentstatus;

public class WaitingForApproval extends DocumentStatus{
	private String documentStatusName = "Waiting for Approval";
	@Override
	public String getDocumentStatusName() {
		// TODO Auto-generated method stub
		return documentStatusName;
		
	}
	
}