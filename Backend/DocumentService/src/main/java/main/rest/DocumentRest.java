package main.rest;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
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

import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataParam;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import main.model.Document;
import main.model.documentstatus.*;
import mongodb.dao.DocumentDAO;

@Named
@Path("/")
public class DocumentRest{
	

	private Document document;
	private Date date;
	private static List<Document> documents = new ArrayList<Document>();
	private ClassPathXmlApplicationContext ctx = new ClassPathXmlApplicationContext("spring.xml");
	private DocumentDAO documentDAO = ctx.getBean("documentDAO", DocumentDAO.class);
	
	@Inject
	private RestTemplate restTemplate;
	
	
	@GET
	@Path("getalldocuments")
	@Produces(MediaType.APPLICATION_JSON)
	public List<Document> getAllDocuments() {
		System.out.println("GET Request: getalldocuments");
		return documentDAO.getAllDocuments();
	}
	
	@GET
	@Path("getdocument")
	@Produces(MediaType.APPLICATION_JSON)
	public Document getdocument(
			@QueryParam("documentid") String id) {
		System.out.println("GET Request: getdocument");
		return documentDAO.readById(id);
	}
	
	@GET
	@Path("getalldocumentsbyuserid")
	@Produces(MediaType.APPLICATION_JSON)
	public List<Document> getdocumentbyuserid(
			@QueryParam("userid") String id) {
		System.out.println("GET Request: getalldocumentsbyuserid");
		documents = documentDAO.getAllDocumentsByUserId(id);
		return documents;
	}
	
	
	@POST
	@Path("newdraft")
	@Consumes(MediaType.APPLICATION_FORM_URLENCODED)
	@Produces(MediaType.APPLICATION_JSON)
	public Document createNewDraftdocument(
			@FormParam("documentName") String name, 
			@FormParam("description") String description,
			@FormParam("creator") String creatorId
			) {
		System.out.println("GET Request: newdraft");
		
		date = new Date();
		document = new Document(name, description, date, new Draft(), creatorId, "56a0d083d4c607b2e7a60a5c", "0.0");
		
		documentDAO.create(document);
		
		return document;
	}
	
	@GET
	@Path("newdocument")
	@Produces(MediaType.APPLICATION_JSON)
	public Document createNewdocument(
			@QueryParam("documentName") String name, 
			@QueryParam("description") String description,
			@QueryParam("creator") String creatorId) {
		System.out.println("GET Request: newdocument");
		date = new Date();
		document = new Document(name, description, date, new WaitingForApproval(), creatorId, "56a0d083d4c607b2e7a60a5c", "0.0");
		documentDAO.create(document);
		return document;
	}
	

	@POST
	@Path("save")
	@Consumes(MediaType.APPLICATION_FORM_URLENCODED)
	@Produces(MediaType.APPLICATION_JSON)
	public Document savedocument(
			@FormParam("documentId") String id, 
			@FormParam("documentName") String name,
			@FormParam("description") String description
		) {
		System.out.println("GET Request: save");
		date = new Date();
		document = documentDAO.readById(id);
		if (document == null) {
			System.err.println("null");
		}
		document.setDocumentName(name);
		document.setDescription(description);
		document.setLastModifiedDate(date);
		documentDAO.update(document);
		return document;
	}
	
	@GET
	@Path("submit")
	@Produces(MediaType.APPLICATION_JSON)
	public Document submitdocumentToApprove(
			@QueryParam("documentid") String id) {
		System.out.println("GET Request: submit");
		document = documentDAO.readById(id);
		document.setDocumentStatus(new WaitingForApproval().getDocumentStatusName());
		documentDAO.update(document);
		return document;
	}
	
	@GET
	@Path("approve")
	@Produces(MediaType.APPLICATION_JSON)
	public Document approveThedocument(
			@QueryParam("documentid") String id) {
		System.out.println("GET Request: approve");
		document = documentDAO.readById(id);
		document.setDocumentStatus(new Approved().getDocumentStatusName());
		documentDAO.update(document);
		return document;
	}
	
	@GET
	@Path("publish")
	@Produces(MediaType.APPLICATION_JSON)
	public Document publishThedocument(
			@QueryParam("documentid") String id) {
		System.out.println("GET Request: publish");
		document = documentDAO.readById(id);
		document.setDocumentStatus(new Publish().getDocumentStatusName());
		documentDAO.update(document);
		return document;
	}
	
	@GET
	@Path("reject")
	@Produces(MediaType.APPLICATION_JSON)
	public Document rejectDocument(
			@QueryParam("documentid") String id) {
		System.out.println("GET Request: reject");
		document = documentDAO.readById(id);
		document.setDocumentStatus(new Reject().getDocumentStatusName());
		documentDAO.update(document);
		return document;
	}
	
	@GET
	@Path("delete")
	@Produces(MediaType.APPLICATION_JSON)
	public void deleteDocument(
			@QueryParam("documentid") String id) {
		System.out.println("GET Request: delete");
		int temp = documentDAO.deleteById(id);
		System.out.println("deleted "+temp+" document(s)");
	}
	

}
