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

import main.model.ApproverList;
import mongodb.dao.ApproverListDAO;

@Named
@Path("/")
public class ApproverListRest {
	
	private ApproverList approverList;
	private List<ApproverList> approverLists;
	
	private ClassPathXmlApplicationContext ctx = new ClassPathXmlApplicationContext("spring.xml");
	private ApproverListDAO approverListDAO = ctx.getBean("approverListDAO", ApproverListDAO.class);
	
	@Inject
	private RestTemplate restTemplate;
	
	@GET
	@Path("approverLists")
	@Produces(MediaType.APPLICATION_JSON)
	public Response approverLists(){
		approverLists = approverListDAO.getApproverLists();
		return Response.status(200).entity(approverLists).build();
	}
	
	@GET
	@Path("approverList")
	@Produces(MediaType.APPLICATION_JSON)
	public Response approverListById(@QueryParam("approverListId") String approverListId){

		approverList = approverListDAO.readById(approverListId);
		if(approverList == null) return Response.status(404).entity("404 publish document not found").build();
		return Response.status(200).entity(approverList).build();
	}
	
	@GET
	@Path("approverListByDocumentId")
	@Produces(MediaType.APPLICATION_JSON)
	public Response approverListByDocumentId(@QueryParam("documentId") String documentId){

		approverList = approverListDAO.readByDocumentId(documentId);
		if(approverList == null) return Response.status(404).entity("404 publish document not found").build();
		return Response.status(200).entity(approverList).build();
	}
	
	@GET
	@Path("addApproverList")
	@Produces(MediaType.APPLICATION_JSON)
	public Response addApproverList(@QueryParam("documentId") String documentId, @QueryParam("approverIdList[]") List<String> approverIdList){
		System.out.println("GET : Add Approver List");
		approverList = new ApproverList(documentId, approverIdList, 0);
		approverListDAO.create(approverList);
		System.out.println("GET : Added!");
		return Response.status(200).entity(approverList).build();
	}
	
	@GET
	@Path("update")
	@Produces(MediaType.APPLICATION_JSON)
	public Response updateApproverList(@QueryParam("documentId") String documentId, @QueryParam("approverIdList[]") List<String> approverIdList){
		System.out.println("GET request : update approver");
		
		ApproverList temp = new ApproverList(documentId, approverIdList, 0);
		approverListDAO.update(documentId, temp);
		System.out.println("GET request : updated!");
		return Response.status(200).entity(temp).build();
	}
	
	@GET
	@Path("approve")
	@Produces(MediaType.TEXT_PLAIN)
	public Response approve(@QueryParam("documentId") String documentId){
		approverList = approverListDAO.readByDocumentId(documentId);
		if(approverList != null){
			approverList.approve();
			approverListDAO.update(documentId, approverList);
			if (approverList.getApproverIdList().size() == approverList.getCurrentApproverIdIndex()){
				System.out.println("this document "+documentId+" review is done");
				return Response.status(200).entity("done").build();
			}
			else{
				System.out.println("return approver id: "+approverList.getApproverIdList().get(approverList.getCurrentApproverIdIndex()));
				return Response.status(200).entity(approverList.getApproverIdList().get(approverList.getCurrentApproverIdIndex())).build();
			}
		}
		else return Response.status(404).entity("ApproverList not found").build();
		
		
		
	}
	
	@GET
	@Path("copy")
	@Produces(MediaType.APPLICATION_JSON)
	public Response copy(@QueryParam("copyFrom") String copyFrom, @QueryParam("copyTo") String copyTo){
		approverList = approverListDAO.readByDocumentId(copyFrom);
		ApproverList tempApproverList = new ApproverList(copyTo, approverList.getApproverIdList(), 0);
		approverListDAO.create(tempApproverList);
		return Response.status(200).entity(tempApproverList).build();
	}

}
