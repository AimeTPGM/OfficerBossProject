package mongodb.dao;

import java.util.List;

import main.model.Document;

public interface DocumentDAO {
	 
    public List<String> create(Document document);
    
    public List<Document> getAllDocuments();
    
    public List<Document> getAllDocumentsByUserId(String id);
    
    public List<Document> getAllDocumentsByApproverId(String id);
     
    public Document readById(String id);
     
    public void update(Document document);
     
    public int deleteById(String id);
}