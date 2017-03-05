package main.rest;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

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

import org.apache.tomcat.util.http.fileupload.IOUtils;
import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataParam;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import main.model.MyFile;
import main.model.MyFileWithoutIS;
import mongodb.dao.FileDAO;
import mongodb.main.MongoDBMain;



@Named
@Path("/")
public class FileRest {
	private ApplicationContext ctx = MongoDBMain.getContext();
	private FileDAO fileDAO = ctx.getBean("fileDAO", FileDAO.class);
	

	@GET
	@Path("files")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getAllFile(){
		List<Map> files = fileDAO.getAllFiles();
		return Response.ok().entity("check at console")
                .build();
	}
	
	@GET
	@Path("delete")
	public Response deleteFileById(@QueryParam("id") String id){
		fileDAO.deleteById(id);
		return Response.ok().entity("Deleted!")
                .build();
	}
	
	@GET
	@Path("deleteAllByDocumentId")
	public Response deleteAllFileByDocumentId(@QueryParam("documentId") String documentId){
		List<MyFile> temp = new ArrayList<MyFile>();
		temp = fileDAO.readAllByDocumentId(documentId);
		if(temp == null) return Response.status(404).entity("File not Found").build();
		for (int i = 0; i < temp.size(); i++) {
			deleteFileById(temp.get(i).getId());
		}
		return Response.ok().entity("Deleted all")
                .build();
	}
	
	@GET
	@Path("allFileDetail")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getAllFileDetail(@QueryParam("documentId") String id){
		List<MyFile> temp = new ArrayList<MyFile>();
		temp = fileDAO.readAllByDocumentId(id);
		if(temp == null) return Response.status(200).entity(temp).build();
		List<MyFileWithoutIS> files = new ArrayList<MyFileWithoutIS>();
		for (int i = 0; i < temp.size(); i++) {
			System.out.println(temp.get(i).getFilename());
			MyFileWithoutIS file = new MyFileWithoutIS();
			file.setFilename(temp.get(i).getFilename());
			file.setId(temp.get(i).getId());
			file.setDocumentId(temp.get(i).getDocumentId());
			files.add(file);
		}
		return Response.ok().entity(files)
                .build();
	}
	
	@GET
	@Path("downloadById")
	public Response downloadFileById(@QueryParam("id") final String id){
		final MyFile temp = fileDAO.readById(id);
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
	
	
	

	@POST
    @Path("upload")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
	public Response uploadFile(@FormDataParam("file") InputStream fileIS, 
			@FormDataParam("file") FormDataContentDisposition fileDetail, 
			@FormDataParam("documentId") String documentId) throws IOException {

	    if (fileDetail == null || fileIS == null) return Response.status(400).build();
	   
	    
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
		List<MyFile> files = new ArrayList<MyFile>();
		files = fileDAO.readAllByDocumentId(copyFromId);
		for (int i = 0; i < files.size(); i++) {
			MyFile temp = new MyFile();
			temp = fileDAO.readById(files.get(i).getDocumentId());
			if(temp == null) continue;
			temp.setDocumentId(copyToId);
			fileDAO.create(temp.getInputStream(), temp.getFilename(), temp.getDocumentId());
			
		}
		String output = "successfully copy "+files.size()+" files from document: "+copyFromId+" to "+copyToId;
		System.out.println(output);
	    return Response.status(200).entity(output).build();
	}
	
	
}