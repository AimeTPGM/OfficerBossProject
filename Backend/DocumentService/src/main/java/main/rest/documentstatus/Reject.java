package main.rest.documentstatus;

public class Reject extends DocumentStatus{

	private String documentStatusName = "Reject";
	@Override
	public String getDocumentStatusName() {
		return documentStatusName;
	}

}
