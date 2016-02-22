package mongodb.dao;

import java.util.List;

import main.model.PublishDocument;

public interface PublishDocumentDAO {
	
	public List<PublishDocument> getPublishDocumentList();
	public void create(PublishDocument publishDocument);
	public void update(PublishDocument publishDocument);
	public void delete(String id);
	public PublishDocument readById(String id);

}
