package mongodb.dao;

import java.io.InputStream;

import main.model.MyFile;

public interface FileDAO {
	 
    public void create(InputStream inputStream, String filename, String documentId);
    
    public void getAllFiles();
    
    public MyFile readByDocumentId(String id);
     
    public InputStream readById(String id);
     
    public void deleteById(String id);
    
    public void deleteByDocumentId(String id);

}