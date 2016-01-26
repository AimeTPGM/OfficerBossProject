package main.rest.documentstatus;

public class Publish extends DocumentStatus{
	private String documentStatusName = "Publish";
	@Override
	public String getDocumentStatusName() {
		return documentStatusName;
	}

}
