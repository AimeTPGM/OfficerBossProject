package mongodb.dao;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.mongodb.gridfs.GridFS;
import com.mongodb.gridfs.GridFSDBFile;
import com.mongodb.gridfs.GridFSInputFile;

import main.model.MyFile;
import main.model.MyFileWithoutIS;
import mongodb.main.MongoDBMain;

public class FileDAOImpl implements FileDAO{
	private MongoOperations mongoOps;
	private static final String COLLECTION = MongoDBMain.getCollection();
	private static final String DB_NAME = MongoDBMain.getDBName();
	private static final DB DB = MongoDBMain.getMongoClient().getDB(DB_NAME);
	private static final GridFS gfs = new GridFS(DB,COLLECTION);
	public FileDAOImpl(MongoOperations mongoOps){
        this.mongoOps=mongoOps;
    }

	public void create(InputStream inputStream, String filename, String documentId) {
		System.out.println("DAO: putting file to DB");
		GridFS gfs = new GridFS(DB,COLLECTION);
		GridFSInputFile gfsFile = gfs.createFile(inputStream, filename);
		gfsFile.put("documentId", documentId);
		gfsFile.save();
		System.out.println("DAO: success");
	}

	public List<Map> getAllFiles() {
		List<Map> files = new ArrayList<Map>();
		Map<String, String> filesdetail = new HashMap<String, String>();
		DBCursor cursor = gfs.getFileList();
		while (cursor.hasNext()) {
			filesdetail.clear();
			DBObject temp = cursor.next();
			System.out.println(temp);
			filesdetail.put("documentId", (String) temp.get("documentId"));
			filesdetail.put("filename", (String) temp.get("filename"));
			files.add(filesdetail);
		}
		return files;
	}

	public MyFile readByDocumentId(String documentId) {
		MyFile temp = new MyFile();
		System.out.println("DAO: querying file by document id: "+documentId);
		BasicDBObject query = new BasicDBObject();
		query.put("documentId", documentId);
		GridFSDBFile result = gfs.findOne(query);
		if (result != null){
			System.out.println("DAO: returning a file, filename: "+result.getFilename());
			temp.setFilename(result.getFilename());
			temp.setInputStream(result.getInputStream());
		}
		else {
			temp = null;
		}
		
		return temp;
	}
	
	public List<MyFile> readAllByDocumentId(String documentId){
		System.out.println("DAO: Querying all files by document id: "+documentId);
		BasicDBObject query = new BasicDBObject();
		query.put("documentId", documentId);
		List<GridFSDBFile> result = gfs.find(query);
		if(result.size() == 0) return null;
		List<MyFile> files = new ArrayList<MyFile>();
		for (int i = 0; i < result.size(); i++) {
			MyFile file = new MyFile();
			file.setId(result.get(i).getId().toString());
			file.setDocumentId(documentId);
			file.setFilename(result.get(i).getFilename());
			file.setInputStream(result.get(i).getInputStream());
			files.add(file);
		}
		return files;
	}


	public MyFile readById(String id) {
		System.out.println("DAO: querying file by file id: "+id);
		BasicDBObject query = new BasicDBObject();
		query.put("_id", new ObjectId(id));
		GridFSDBFile result = gfs.findOne(query);
		System.out.println("DAO: returning a file");
		MyFile temp = new MyFile();
		if (result != null){
			System.out.println("DAO: returning a file, filename: "+result.getFilename());
			temp.setFilename(result.getFilename());
			temp.setInputStream(result.getInputStream());
		}
		else {
			temp = null;
		}
		
		return temp;
	}
	
	

	public void deleteById(String id) {
		System.out.println("DAO: deleting file by file id: "+id);
		BasicDBObject query = new BasicDBObject();
		query.put("_id", new ObjectId(id));
		gfs.remove(gfs.findOne(query));
		System.out.println("DAO: deleted!");
	}

	public void deleteByDocumentId(String id) {
		// TODO Auto-generated method stub
		
	}
}
