package mongodb.dao;

import java.io.InputStream;
import java.util.List;
import java.util.Map;

import com.mongodb.DBObject;

import main.model.MyFile;

public interface FileDAO {
	 
    public void create(InputStream inputStream, String filename, String documentId);
    
    public List<Map> getAllFiles();
    
    public MyFile readByDocumentId(String id);
    
    public List<MyFile> readAllByDocumentId(String documentId);
     
    public MyFile readById(String id);
     
    public void deleteById(String id);
    
    public void deleteByDocumentId(String id);

}