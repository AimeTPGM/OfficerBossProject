package mongodb.dao;

import java.util.List;

import main.model.Folder;

public interface FolderDAO {
	
	public List<Folder> getAllFolders();
	
	public void create(Folder folder);
	
	public Folder readById(String id);
	
	public List<Folder> readByCreatorId(String id);
	
	public Folder readByDocumentId(String id);
	
	public void update(Folder folder);
	
	public void delete(String id);

}
