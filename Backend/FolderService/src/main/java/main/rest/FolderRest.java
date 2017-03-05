package main.rest;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.inject.Inject;
import javax.inject.Named;
import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.web.client.RestTemplate;

import main.model.Folder;
import mongodb.dao.FolderDAO;
import mongodb.main.MongoDBMain;


@Named
@Path("/")
public class FolderRest {
	
	public List<Folder> folders = new ArrayList<Folder>();
	public Folder folder;
	
	private ApplicationContext ctx = MongoDBMain.getContext();
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
		folder = folderDAO.readById(id);
		return Response.status(200).entity(folder).build();
	}
	
	@GET
	@Path("getFolderByCreatorId")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getFolderByCreatorId(@QueryParam("creatorId") String id) {
		folders = folderDAO.readByCreatorId(id);
		return Response.status(200).entity(folders).build();
	}
	
	@POST
	@Path("createFolder")
	@Consumes(MediaType.APPLICATION_FORM_URLENCODED)
	@Produces(MediaType.APPLICATION_JSON)
	public Response createFolder(
			@FormParam("folderName") String folderName,
			@FormParam("creatorId") String creatorId){
		folder = new Folder(folderName, new Date(), creatorId);
		folderDAO.create(folder);
		return Response.status(200).entity(folder).build();
	}
	
	@POST
	@Path("update")
	@Consumes(MediaType.APPLICATION_FORM_URLENCODED)
	@Produces(MediaType.APPLICATION_JSON)
	public Response updateFolder(
			@FormParam("folderId") String id,
			@FormParam("folderName") String folderName){
		folder = folderDAO.readById(id);
		folder.setFolderName(folderName);
		folder.setLastUpdate(new Date());
		folderDAO.update(folder);
		System.out.println("updated folder");
		return Response.status(200).entity(folder).build();
	}
	
	@GET
	@Path("addDocument")
	@Produces(MediaType.APPLICATION_JSON)
	public Response addDocument(@QueryParam("folderId") String id,
			@QueryParam("documentId") String documentId){
		folder = folderDAO.readById(id);
		folder.getDocumentList().add(documentId);
		folder.setNumberOfDocument(folder.getDocumentList().size());
		folder.setLastUpdate(new Date());
		folderDAO.update(folder);
		return Response.status(200).entity(folder).build();
	}
	
	
	@GET
	@Path("deleteById")
	@Produces(MediaType.APPLICATION_JSON)
	public Response deleteById(@QueryParam("folderId") String id){
		folderDAO.delete(id);
		String response = "deleted!";
		return Response.status(200).entity(response).build();
	}
	
	@GET
	@Path("getFolderByDocumentId")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getFolderByDocumentId(@QueryParam("documentId") String id){
		folder = folderDAO.readByDocumentId(id);
		return Response.status(200).entity(folder).build();
	}

	
	
}
