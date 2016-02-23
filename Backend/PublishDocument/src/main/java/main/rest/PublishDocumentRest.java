package main.rest;

import java.util.Date;
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

import main.model.PublishDocument;
import mongodb.dao.PublishDocumentDAO;

@Named
@Path("/")
public class PublishDocumentRest {
	
	private PublishDocument publishDocument;
	private List<PublishDocument> publishDocumentList;
	
	private ClassPathXmlApplicationContext ctx = new ClassPathXmlApplicationContext("spring.xml");
	private PublishDocumentDAO publishDocumentDAO = ctx.getBean("publishDocumentDAO", PublishDocumentDAO.class);
	
	@Inject
	private RestTemplate restTemplate;
	
	@GET
	@Path("publishDocuments")
	@Produces(MediaType.APPLICATION_JSON)
	public Response publishDocuments(){
		publishDocumentList = publishDocumentDAO.getPublishDocumentList();
		return Response.status(200).entity(publishDocumentList).build();
	}
	
	@GET
	@Path("publishDocument")
	@Produces(MediaType.APPLICATION_JSON)
	public Response publishDocument(@QueryParam("documentId") String documentId){

		publishDocument = publishDocumentDAO.readById(documentId);
		if(publishDocument == null) return Response.status(404).entity("404 publish document not found").build();
		return Response.status(200).entity(publishDocument).build();
	}
	
	@GET
	@Path("addPublishDocument")
	@Produces(MediaType.APPLICATION_JSON)
	public Response publishDocument(@QueryParam("documentId") String documentId, @QueryParam("documentName") String documentName){
		publishDocument = new PublishDocument(documentId, new Date(), documentName);
		publishDocumentDAO.create(publishDocument);
		return Response.status(200).entity(publishDocument).build();
	}
	
	
	@GET
	@Path("unpublished")
	public Response unpublishDocument(@QueryParam("documentId") String documentId){
		//TODO remove publish document from list
		publishDocumentDAO.delete(documentId);
		return Response.status(200).entity("Unpublised the document: "+documentId).build();
	}

}
