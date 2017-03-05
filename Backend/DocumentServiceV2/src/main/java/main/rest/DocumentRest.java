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

import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.web.client.RestTemplate;

import main.model.Document;
import main.model.Folder;
import main.model.documentstatus.*;
import mongodb.dao.DocumentDAO;
import mongodb.dao.FolderDAO;
import mongodb.main.MongoDBMain;

@Named
@Path("/")
public class DocumentRest{
	

	private Document document;
	private static List<Document> documents = new ArrayList<Document>();
	private static List<String> documentIdList = new ArrayList<String>();
	private static List<Folder> folders = new ArrayList<Folder>();
	private static Folder folder = new Folder();
	private ApplicationContext ctx = MongoDBMain.getContext();
	private DocumentDAO documentDAO = ctx.getBean("documentDAO", DocumentDAO.class);
	private FolderDAO folderDAO = ctx.getBean("folderDAO", FolderDAO.class);
	
	@Inject
	private RestTemplate restTemplate;
	
	public Response okStatus(Object obj){
		return Response.status(200).entity(obj).build();
	}
	
	public Response notFoundStatus(Object obj){
		return Response.status(404).entity(obj).build();
	}
	
	public void clear(){
		documents = new ArrayList<Document>();
		documentIdList = new ArrayList<String>();
		folders = new ArrayList<Folder>();
		folder = new Folder();	
	}
	
	@GET
	@Path("getDocuments")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getDocuments() {
		clear();
		System.out.println("GET Request: get all documents");
		documents = documentDAO.getAllDocuments();
		return okStatus(documents);
	}
	
	@GET
	@Path("getDocument")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getDocument(
			@QueryParam("documentId") String documentId,
			@QueryParam("folderId") String folderId
			) {
		clear();
		System.out.println("GET Request: get document");
		document = documentDAO.readById(documentId);
		if(document == null) return notFoundStatus("404 Document Not Found");
		System.out.println("this is folder id:"+folderId);
		
		folder = folderDAO.readById(folderId);
		for (int i = 0; i < folder.getDocumentList().size(); i++) {
			Document tempDocument = documentDAO.readById(folder.getDocumentList().get(i));
			documents.add(tempDocument);
		}
		
		List<Object> response = new ArrayList<Object>();
		response.add(folder);
		response.add(document);
		response.add(documents);
		
		return okStatus(response);
	}
	
	@GET
	@Path("getFolders")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getFolders() {
		clear();
		System.out.println("GET Request: get all folders");
		folders = folderDAO.getAllFolders();
		return okStatus(folders);
	}
	
	@GET
	@Path("getFolder")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getFolders(@QueryParam("folderId") String folderId) {
		clear();
		System.out.println("GET Request: get all folders");
		folder = folderDAO.readById(folderId);
		return okStatus(folder);
	}
	
	@GET
	@Path("getDocumentsByUserId")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getDocumentByUserId(
			@QueryParam("userId") String id) {
		clear();
		System.out.println("GET Request: get all documents by user id");
		documents = documentDAO.getAllDocumentsByUserId(id);
		if(documents == null) return notFoundStatus("404 Document Lists not Found");
		return okStatus(documents);
	}
	
	public void newDraft(String name, String description, String creatorId){
		System.out.println("creating Draft document");
		Date date = new Date();
		document = new Document(name, description, date, date, new Draft().getDocumentStatusName(), creatorId, 0, 0, true);
		List<String> doc = documentDAO.create(document);
		document.setDocumentId(doc.get(0));
		documentIdList.add(doc.get(0));
		System.out.println("created!");
	}
	
	public void newDocument(String name, String description, String creatorId){
		System.out.println("creating Waiting for Approval document");
		Date date = new Date();
		document = new Document(name, description, date, date, new WaitingForApproval().getDocumentStatusName(), creatorId, 0, 0, true);
		List<String> doc = documentDAO.create(document);
		document.setDocumentId(doc.get(0));
		documentIdList.add(doc.get(0));
		System.out.println("created!");
	}
	
	public void newFolder(){
		System.out.println("creating new folder");
		
		folder = new Folder(documentIdList, document.getDocumentName(), document.getLastModifiedDate(), document.getCreatorId());
		folderDAO.create(folder);
		System.out.println("created!");
	}
	public void addDocumentToFolder(String folderId){
		System.out.println("addinng new draft document to an exisiting folder");
		folder = folderDAO.readById(folderId);
		folder.setFolderName(document.getDocumentName());
		folder.setLastUpdate(document.getLastModifiedDate());
		folder.addDocument(document.getDocumentId());
		folder = folderDAO.update(folder);
	}
	
	public void getAllDocumentInFolder(String folderId){
		System.out.println("getting all document in folder");
		for (int i = 0; i < folder.getDocumentList().size(); i++) {
			documents.add(documentDAO.readById(folder.getDocumentList().get(i)));
		}
	}
	
	public void updateFolder(String folderId){
		
	}
	
	@POST
	@Path("newDraft")
	@Consumes(MediaType.APPLICATION_FORM_URLENCODED)
	@Produces(MediaType.APPLICATION_JSON)
	public Response createNewDraftdocument(
			@FormParam("documentName") String name, 
			@FormParam("description") String description,
			@FormParam("creatorId") String creatorId,
			@FormParam("folderId") String folderId
			) {
		clear();
		System.out.println("GET Request: new draft");
		newDraft(name, description, creatorId);
		if(folderId == null){
			newFolder();
		}
		else if(folderId != null){
			addDocumentToFolder(folderId);
		}
		getAllDocumentInFolder(folderId);
		List<Object> jsonResponse = new ArrayList<Object>();
		jsonResponse.add(folder);
		jsonResponse.add(documents);
		
		return okStatus(jsonResponse);
	}
	
	@POST
	@Path("newDocument")
	@Consumes(MediaType.APPLICATION_FORM_URLENCODED)
	@Produces(MediaType.APPLICATION_JSON)
	public Response createNewDocument(
			@FormParam("documentName") String name, 
			@FormParam("description") String description,
			@FormParam("creatorId") String creatorId,
			@FormParam("folderId") String folderId) {
		clear();
		System.out.println("GET Request: new draft");
		newDocument(name, description, creatorId);
		if(folderId == null){
			newFolder();
		}
		else if(folderId != null){
			addDocumentToFolder(folderId);
		}
		getAllDocumentInFolder(folderId);
		List<Object> jsonResponse = new ArrayList<Object>();
		jsonResponse.add(folder);
		jsonResponse.add(documents);
		
		return okStatus(jsonResponse);
	}
	

	@POST
	@Path("save")
	@Consumes(MediaType.APPLICATION_FORM_URLENCODED)
	@Produces(MediaType.APPLICATION_JSON)
	public Response saveDocument(
			@FormParam("documentId") String documentId, 
			@FormParam("documentName") String name,
			@FormParam("description") String description,
			@FormParam("folderId") String folderId
		) {
		clear();
		System.out.println("GET Request: save");
		document = documentDAO.readById(documentId);
		if (document == null) return notFoundStatus("404 Document not Found");
		System.out.println("updating document");
		document.setDocumentName(name);
		document.setDescription(description);
		document.setLastModifiedDate(new Date());
		document.setEditable(true);
		documentDAO.update(document);
		documents.add(document);
		System.out.println("updated!");
		folder = folderDAO.readById(folderId);
		System.out.println("updating folder");
		folder.setFolderName(name);
		folder.setLastUpdate(document.getLastModifiedDate());
		folder = folderDAO.update(folder);
		System.out.println("updated!");
		List<Object> jsonResponse = new ArrayList<Object>();
		jsonResponse.add(folder);
		jsonResponse.add(documents);
		return okStatus(document);
	}
	
	@GET
	@Path("submit")
	@Produces(MediaType.APPLICATION_JSON)
	public Response submitDocument(
			@QueryParam("documentId") String id,
			@QueryParam("versionType") String versionType) {
		clear();
		System.out.println("GET Request: submit");
		System.out.println("submitting document");
		document = documentDAO.readById(id);
		if (document == null) return notFoundStatus("404 Document not Found");
		
		document.setDocumentStatus(new WaitingForApproval().getDocumentStatusName());
		if(versionType.equals("minor")) {
			int temp = document.getMinorVersion();
			temp++;
			document.setMinorVersion(temp);
			document.setVersion();
			
		}
		else if(versionType.equals("major")) {
			int temp = document.getMajorVersion();
			temp++;
			document.setMajorVersion(temp);
			document.setMinorVersion(0);
			document.setVersion();
		}
		else return Response.status(400).entity("Bad version request").build();
		document.setEditable(false);
		documentDAO.update(document);
		System.out.println("submitted!");
		return okStatus(document);
	}
	
	@GET
	@Path("approve")
	@Produces(MediaType.APPLICATION_JSON)
	public Response approveDocument(
			@QueryParam("documentId") String id) {
		clear();
		System.out.println("GET Request: approve");
		document = documentDAO.readById(id);
		if (document == null) return notFoundStatus("404 Document not Found");
		document.setDocumentStatus(new Approved().getDocumentStatusName());
		document.setEditable(false);
		documentDAO.update(document);
		return okStatus(document);
	}
	
	@GET
	@Path("publish")
	@Produces(MediaType.APPLICATION_JSON)
	public Response publishDocument(
			@QueryParam("documentId") String id) {
		clear();
		System.out.println("GET Request: publish");
		document = documentDAO.readById(id);
		if (document == null) return notFoundStatus("404 Document not Found");
		document.setDocumentStatus(new Publish().getDocumentStatusName());
		document.setEditable(false);
		documentDAO.update(document);
		return okStatus(document);
	}
	
	@GET
	@Path("reject")
	@Produces(MediaType.APPLICATION_JSON)
	public Response rejectDocument(
			@QueryParam("documentId") String id) {
		clear();
		System.out.println("GET Request: reject");
		document = documentDAO.readById(id);
		if (document == null) return notFoundStatus("404 Document not Found");
		document.setDocumentStatus(new Reject().getDocumentStatusName());
		document.setEditable(false);
		documentDAO.update(document);
		return okStatus(document);
	}
	
	@GET
	@Path("editable")
	@Produces(MediaType.APPLICATION_JSON)
	public Response setEditable(
			@QueryParam("documentId") String id, @QueryParam("editable") boolean editable) {
		clear();
		document = documentDAO.readById(id);
		if (document == null) return notFoundStatus("404 Document not Found");
		document.setEditable(editable);
		documentDAO.update(document);
		return okStatus(document);
	}
	
	@GET
	@Path("delete")
	@Produces(MediaType.APPLICATION_JSON)
	public Response deleteDocument(
			@QueryParam("documentId") String id) {
		clear();
		System.out.println("GET Request: delete");
		int temp = documentDAO.deleteById(id);
		System.out.println("deleted "+temp+" document(s)");
		return okStatus("Deleted!");
	}
	
	@POST
	@Path("newEditDraft")
	@Consumes(MediaType.APPLICATION_FORM_URLENCODED)
	@Produces(MediaType.APPLICATION_JSON)
	public Response createNewEditDraftdocument(
			@FormParam("documentName") String name, 
			@FormParam("description") String description,
			@FormParam("documentId") String documentId,
			@FormParam("folderId") String folderId
			) {
		clear();
		System.out.println("GET Request: new edit draft");
		document = documentDAO.readById(documentId);
		document.setEditable(false);
		documentDAO.update(document);
		Date date = new Date();
		Document newDocument = new Document(name, description, date, date, new Draft().getDocumentStatusName(), document.getCreatorId(),document.getMajorVersion(),document.getMinorVersion(),true);
		List<String> result = documentDAO.create(newDocument);
		newDocument.setDocumentId(result.get(0));
		folder = folderDAO.readById(folderId);
		folder.setFolderName(name);
		folder.addDocument(result.get(0));
		folderDAO.update(folder);
		List<Object> response = new ArrayList<Object>();
		response.add(folder);
		response.add(newDocument);
		return okStatus(response);
	}
	
	@GET
	@Path("unpublished")
	@Produces(MediaType.APPLICATION_JSON)
	public Response unpublishedDocument(
			@QueryParam("documentId") String id) {
		clear();
		System.out.println("GET Request: publish");
		document = documentDAO.readById(id);
		if (document == null) return notFoundStatus("404 Document not Found");
		document.setDocumentStatus(new Approved().getDocumentStatusName());
		document.setEditable(false);
		documentDAO.update(document);
		return okStatus(document);
	}
	
	@GET
	@Path("changeApprover")
	@Produces(MediaType.APPLICATION_JSON)
	public Response changeApprover(
			@QueryParam("documentId") String id, @QueryParam("approverId") String approverId) {
		clear();
		System.out.println("GET Request: change approver to "+approverId);
		document = documentDAO.readById(id);
		if (document == null) return notFoundStatus("404 Document not Found");
		document.setApproverId(approverId);
		documentDAO.update(document);
		return okStatus(document);
	}
	
	@GET
	@Path("getDocumentByApproverId")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getDocumentByApproverId(
			@QueryParam("approverId") String id) {
		clear();
		System.out.println("GET Request: get all documents by approver id");
		documents = documentDAO.getAllDocumentsByApproverId(id);
		if(documents == null) return notFoundStatus("404 Document Lists not Found");
		for (int i = 0; i < documents.size(); i++) {
			folders.add(folderDAO.readByDocumentId(documents.get(i).getDocumentId()));
		}
		List<Object> response = new ArrayList<Object>();
		response.add(folders);
		response.add(documents);
		return okStatus(response);
	}
	
	@GET
	@Path("getFolderByCreatorId")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getFolderByCreatorId(@QueryParam("creatorId") String id) {
		clear();
		folders = folderDAO.readByCreatorId(id);
		for (int i = 0; i < folders.size(); i++) {
			documents.add(documentDAO.readById(folders.get(i).getDocumentList().get(folders.get(i).getDocumentList().size()-1)));
		}
		List<Object> response = new ArrayList<Object>();
		response.add(folders);
		response.add(documents);
		
		return okStatus(response);
	}
	
	@GET
	@Path("folder")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getFolder(@QueryParam("folderId") String id) {
		clear();
		List<Object> response = new ArrayList<Object>();
		folder = folderDAO.readById(id);
		for (int i = 0; i < folder.getDocumentList().size(); i++) {
			documents.add(documentDAO.readById(folder.getDocumentList().get(i)));
		}
		response.add(folder);
		response.add(documents);
		return okStatus(response);
	}
	
	@GET
	@Path("deleteFolderById")
	@Produces(MediaType.APPLICATION_JSON)
	public Response deleteById(@QueryParam("folderId") String id){
		clear();
		folder = folderDAO.readById(id);
		for (int i = 0; i < folder.getDocumentList().size(); i++) {
			documentDAO.deleteById(folder.getDocumentList().get(i));
		}
		folderDAO.delete(id);
		String response = "deleted!";
		return okStatus(response);
	}
	
	@GET
	@Path("getFolderByDocumentId")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getFolderByDocumentId(@QueryParam("documentId") String id){
		clear();
		folder = folderDAO.readByDocumentId(id);
		for (int i = 0; i < folder.getDocumentList().size(); i++) {
			documents.add(documentDAO.readById(folder.getDocumentList().get(i)));
		}
		List<Object> response = new ArrayList<Object>();
		response.add(folder);
		response.add(documents);
		return okStatus(response);
	}
	
	

}
