package main.model.documentstatus;

public abstract class DocumentStatus {
	private String allowEdittingPosition;
	public void setAllowEdittionPosition(String position){
		allowEdittingPosition = position;
	}
	public String getAllowEditionPosition(){
		return allowEdittingPosition;
	}
	public abstract String getDocumentStatusName();

}
