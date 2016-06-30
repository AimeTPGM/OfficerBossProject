package main.model;

import java.util.List;

import org.springframework.data.annotation.Id;

public class ApproverList {
	@Id
	private String id;
	private String documentId;
	private List<String> approverIdList;
	
	public ApproverList(String documentId, List<String> approverIdList){
		setApproverIdList(approverIdList);
		setDocumentId(documentId);
	}

	public List<String> getApproverIdList() {
		return approverIdList;
	}
	public void setApproverIdList(List<String> approverIdList) {
		this.approverIdList = approverIdList;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getDocumentId() {
		return documentId;
	}
	public void setDocumentId(String documentId) {
		this.documentId = documentId;
	}
	

}
