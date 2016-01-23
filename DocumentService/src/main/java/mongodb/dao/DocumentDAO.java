package mongodb.dao;

import java.util.List;

import main.model.Document;

public interface DocumentDAO {
	 
    public void create(Document document);
    
    public List<Document> getAllDocuments();
     
    public Document readById(String id);
     
    public void update(Document document);
     
    public int deleteById(String id);
}