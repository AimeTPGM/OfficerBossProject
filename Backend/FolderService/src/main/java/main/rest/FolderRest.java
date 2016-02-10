package main.rest;

import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;
import javax.inject.Named;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.web.client.RestTemplate;

import main.model.Folder;
import mongodb.dao.FolderDAO;


@Named
@Path("/")
public class FolderRest {
	
	public List<Folder> folders = new ArrayList<Folder>();
	public Folder folder;
	
	private ClassPathXmlApplicationContext ctx = new ClassPathXmlApplicationContext("spring.xml");
	private FolderDAO folderDAO = ctx.getBean("folderDAO", FolderDAO.class);
	
	@Inject
	private RestTemplate restTemplate;
	
	@GET
	@Path("folders")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getFolders() {
		folders = folderDAO.getAllFolders();
		return Response.status(200).entity(folders).build();
	}
	
	@GET
	@Path("folder")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getFolder(@QueryParam("folderId") String id) {
		folder = new Folder();
		folder = folderDAO.readById(id);
		return Response.status(200).entity(folder).build();
	}
	
	@GET
	@Path("addDocument")
	public Response addDocument(@QueryParam("documentId") String id){
		folder = new Folder();
		folder = folderDAO.readById(id);
		folder.getDocumentList().add(id);
		folderDAO.update(folder);
		return Response.status(200).entity(folder).build();
	}
	
	@GET
	@Path("deleteDocument")
	public Response deleteDocument(@QueryParam("documentId") String id){
		folder = new Folder();
		folder = folderDAO.readById(id);
		List<String> temp = folder.getDocumentList();
		for (int i = 0; i < temp.size(); i++) {
			if(temp.get(i).equals(id)) {
				temp.remove(i);
				break;
			}
		}
		return Response.status(200).entity(folder).build();
	}
	
	@GET
	@Path("deleteById")
	public Response deleteById(@QueryParam("folderId") String id){
		folderDAO.delete(id);
		String response = "deleted!";
		return Response.status(200).entity(response).build();
	}
	
}