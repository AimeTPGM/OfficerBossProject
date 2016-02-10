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

import org.springframework.web.client.RestTemplate;

import main.model.Folder;


@Named
@Path("/")
public class FolderRest {
	
	public List<Folder> folders = new ArrayList<Folder>();
	public Folder folder;
	
	@Inject
	private RestTemplate restTemplate;
	
	@GET
	@Path("folders")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getFolders() {
		
		return Response.status(200).entity(folders).build();
	}
	
	@GET
	@Path("folder")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getFolder(@QueryParam("folderId") String id) {
		folder = new Folder();
		return Response.status(200).entity(folder).build();
	
	}
	
	@GET
	@Path("addDocument")
	public Response addDocument(@QueryParam("documentId") String id){
		return Response.status(200).entity(folder).build();
	}
	
	@GET
	@Path("deleteDocument")
	public Response deleteDocument(@QueryParam("documentId") String id){
		return Response.status(200).entity(folder).build();
	}
	
	@GET
	@Path("deleteById")
	public Response deleteById(@QueryParam("folderId") String id){
		String response = "deleted!";
		return Response.status(200).entity(response).build();
	}
	
}
