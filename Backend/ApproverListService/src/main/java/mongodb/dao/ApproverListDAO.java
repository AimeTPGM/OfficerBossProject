package mongodb.dao;

import java.util.List;

import main.model.ApproverList;

public interface ApproverListDAO {
	
	public List<ApproverList> getApproverLists();
	public void create(ApproverList approver);
	public void update(String documentId, ApproverList approverIdList);
	public void delete(String id);
	public void deleteByDocumentId(String id);
	public ApproverList readById(String id);
	public ApproverList readByDocumentId(String id);

}
