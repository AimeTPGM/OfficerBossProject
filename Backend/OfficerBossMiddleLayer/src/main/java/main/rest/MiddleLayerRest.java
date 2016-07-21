package main.rest;

import java.net.URI;
import java.util.List;

import javax.inject.Inject;
import javax.inject.Named;
import javax.swing.text.Document;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import main.model.ApproverList;
import main.model.Folder;

@Named
@Path("/")
public class MiddleLayerRest {
	private String documentServicePath = "http://localhost:8081/";
	private String folderServicePath = "http://localhost:8085/";
	private String approverListServicePath = "http://localhost:8087/";
	
	@Inject
	private RestTemplate restTemplate;
	
	@GET
	@Path("saveWithUploadFile")
	@Produces(MediaType.APPLICATION_JSON)
	public Response newDocument(
			@QueryParam("documentName") String documentName,
			@QueryParam("description") String description,
			@QueryParam("creatorId") String creatorId,
			@QueryParam("approverIdList[]") List<String> approverIdList){
		System.out.println("=========== saveWithUploadFile ===========");
		
		//new draft document
		URI targetUrl= UriComponentsBuilder.fromUriString(documentServicePath)
			    .path("newDraft")
			    .queryParam("documentName", documentName)
			    .queryParam("description", description)
			    .queryParam("creatorId", creatorId)
			    .build()
			    .toUri();
		
		ResponseEntity<Document> documentResp = restTemplate.getForEntity(targetUrl, Document.class);
		org.springframework.http.MediaType contentType = documentResp.getHeaders().getContentType();
		HttpStatus statusCode = documentResp.getStatusCode();
		System.out.println("status: "+statusCode+"\nmediatype: "+statusCode);
		System.out.println("created document");
		main.model.Document document = new main.model.Document(
				(String)documentResp.getBody().getProperty("documentId"),
				(String)documentResp.getBody().getProperty("documentName"),
				(String)documentResp.getBody().getProperty("description"),
				(String)documentResp.getBody().getProperty("createdDate"),
				(String)documentResp.getBody().getProperty("lastModifiedDate"),
				(String)documentResp.getBody().getProperty("documentStatus"), 
				(String)documentResp.getBody().getProperty("creatorId"),
				(String)documentResp.getBody().getProperty("approverId"),
				(String)documentResp.getBody().getProperty("version"),
				(String)documentResp.getBody().getProperty("editable"));
		System.out.println(document.toString());
		
		//new folder
		targetUrl = UriComponentsBuilder.fromUriString(folderServicePath)
			    .path("createFolder")
			    .queryParam("folderName", documentName)
			    .queryParam("creatorId", creatorId)
			    .build()
			    .toUri();

		ResponseEntity<Folder> folderResp = restTemplate.getForEntity(targetUrl, Folder.class);
		contentType = folderResp.getHeaders().getContentType();
		statusCode = folderResp.getStatusCode();
		Folder folder = folderResp.getBody();
		System.out.println("created folder");
		System.out.println("status: "+statusCode+"\nmediatype: "+statusCode);
		System.out.println(folder.toString());
		
		
		//add doc to folder
		targetUrl = UriComponentsBuilder.fromUriString(folderServicePath)
			    .path("addDocument")
			    .queryParam("folderId", folder.getId())
			    .queryParam("documentId", document.getDocumentId())
			    .build()
			    .toUri();
		folderResp = restTemplate.getForEntity(targetUrl, Folder.class);
		contentType = folderResp.getHeaders().getContentType();
		statusCode = folderResp.getStatusCode();
		folder = folderResp.getBody();
		System.out.println("added document to folder");
		System.out.println("status: "+statusCode+"\nmediatype: "+statusCode);
		System.out.println(folder.toString());
		
		//new ApproverList
		targetUrl = UriComponentsBuilder.fromUriString(approverListServicePath)
			    .path("addApproverList")
			    .queryParam("documentId", document.getDocumentId())
			    .queryParam("approverIdList[]", approverIdList)
			    .build()
			    .toUri();
		ResponseEntity<ApproverList> approverListResp = restTemplate.getForEntity(targetUrl, ApproverList.class);
		contentType = approverListResp.getHeaders().getContentType();
		statusCode = approverListResp.getStatusCode();
		ApproverList approverList = approverListResp.getBody();
		System.out.println("added approver list");
		System.out.println("status: "+statusCode+"\nmediatype: "+statusCode);
		System.out.println(approverList.toString());
		//TODO file
		//TODO return document+folder+file+approverList
		return Response.status(200).build();
	}

}
