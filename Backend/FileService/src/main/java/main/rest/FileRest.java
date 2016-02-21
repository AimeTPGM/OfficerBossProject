package main.rest;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Map;

import javax.inject.Named;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.StreamingOutput;

import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataParam;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import main.model.MyFile;
import mongodb.dao.FileDAO;



@Named
@Path("/")
public class FileRest {
	private ClassPathXmlApplicationContext ctx = new ClassPathXmlApplicationContext("spring.xml");
	private FileDAO fileDAO = ctx.getBean("fileDAO", FileDAO.class);

	@GET
	@Path("files")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getAllFile(){
		List<Map> files = fileDAO.getAllFiles();
		return Response.ok().entity(files)
                .build();
	}
	
	@GET
	@Path("delete")
	public Response deleteFileById(@QueryParam("id") String id){
		fileDAO.deleteById(id);
		return Response.ok()
                .build();
	}
	
	@GET
	@Path("deleteByDocumentId")
	public Response deleteFileByDocumentId(@QueryParam("documentId") String documentId){
		fileDAO.deleteByDocumentId(documentId);
		return Response.ok()
                .build();
	}
	
	@GET
	@Path("fileDetail")
	public Response getFileDetail(@QueryParam("documentId") String id){
		MyFile temp = new MyFile();
		temp = fileDAO.readByDocumentId(id);
		if(temp == null) return Response.status(404).entity("File not Found").build();
		String filename = temp.getFilename();
		return Response.ok().entity(filename)
                .build();
	}
	
	@GET
	@Path("download")
	public Response downloadFile(@QueryParam("documentId") final String documentId){
		final MyFile temp = fileDAO.readByDocumentId(documentId);
		StreamingOutput fileStream =  new StreamingOutput() 
        {
            public void write(java.io.OutputStream output) throws IOException, WebApplicationException 
            {
                try
                {
                    InputStream in = temp.getInputStream();
                    byte[] bytes = new byte[1024];
                    int read = 0;
                    while ((read = in.read(bytes)) != -1) {
    					output.write(bytes, 0, read);
    				}
                    output.flush();
                } 
                catch (Exception e) 
                {
                    throw new WebApplicationException("File Not Found !!");
                }
            }
        };
        return Response
                .ok(fileStream, MediaType.APPLICATION_OCTET_STREAM)
                .header("content-disposition","attachment; filename = "+temp.getFilename())
                .build();
		
	}
	
	@GET
	@Path("downloadById")
	public Response downloadFileById(@QueryParam("id") final String id){
		final InputStream temp = fileDAO.readById(id);
		StreamingOutput fileStream =  new StreamingOutput() 
        {
            public void write(java.io.OutputStream output) throws IOException, WebApplicationException 
            {
                try
                {
                    InputStream in = temp;
                    byte[] bytes = new byte[1024];
                    int read = 0;
                    while ((read = in.read(bytes)) != -1) {
    					output.write(bytes, 0, read);
    				}
                    output.flush();
                } 
                catch (Exception e) 
                {
                    throw new WebApplicationException("File Not Found !!");
                }
            }
        };
        return Response
                .ok(fileStream, MediaType.APPLICATION_OCTET_STREAM)
                .header("content-disposition","attachment; filename =")
                .build();
		
	}

	@POST
    @Path("upload")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
	public Response uploadFile(@FormDataParam("file") InputStream fileIS, 
			@FormDataParam("file") FormDataContentDisposition fileDetail, 
			@FormDataParam("documentId") String documentId) throws IOException {

	    if (fileDetail ==null || fileIS==null) return Response.status(400).build();
	   
	    
	    System.out.println("======= Upload to mongo =============");
	    System.out.println("documentId:" +documentId);
	    fileDAO.create(fileIS, fileDetail.getFileName(), documentId);
	  
	    
	  
	    String output = "File saved to  server";
	 
	    return Response.status(200).entity(output).build();
	}
	
	@GET
	@Path("copy")
	public Response copyFile(@QueryParam("copyFrom") String copyFromId,
			@QueryParam("copyTo") String copyToId) throws IOException {
		
		MyFile temp = new MyFile();
		temp = fileDAO.readByDocumentId(copyFromId);
		if(temp == null) System.out.println("TEMP IS NULL");
		System.out.println(copyFromId);
		System.out.println(copyToId);
		
		temp.setDocumentId(copyToId);
		fileDAO.create(temp.getInputStream(), temp.getFilename(), temp.getDocumentId());
		String output = "successfully copy file from document: "+copyFromId+" to "+copyToId;
		System.out.println(output);
	    return Response.status(200).entity(output).build();
	}
	
	
}