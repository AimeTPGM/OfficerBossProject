package mongodb.dao;

import java.util.List;

import main.model.ApproverList;

public interface ApproverListDAO {
	
	public List<ApproverList> getApproverLists();
	public void create(ApproverList approver);
	public void update(ApproverList approver);
	public void delete(String id);
	public ApproverList readById(String id);
	public ApproverList readByDocumentId(String id);

}
