package main.rest;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Paths;

import javax.inject.Named;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.StreamingOutput;

import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataParam;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.context.support.GenericXmlApplicationContext;
import org.springframework.data.mongodb.gridfs.GridFsOperations;
import org.springframework.web.bind.annotation.RequestParam;

import main.model.MyFile;
import mongodb.dao.FileDAO;



@Named
@Path("/")
public class FileRest {
	private ClassPathXmlApplicationContext ctx = new ClassPathXmlApplicationContext("spring.xml");
	private FileDAO fileDAO = ctx.getBean("fileDAO", FileDAO.class);
//	private GridFsOperations gridOperations = 
//            (GridFsOperations) ctx.getBean("gridFsTemplate");
//	
	@GET
	@Path("files")
	public Response getAllFile(){
		fileDAO.getAllFiles();
		return Response.ok()
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
	@Path("deletebydocid")
	public Response deleteFileByDocumentId(@QueryParam("documentId") String documentId){
		fileDAO.deleteByDocumentId(documentId);
		return Response.ok()
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

	@POST
    @Path("/upload")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
	public Response uploadFile( @FormDataParam("file") InputStream fileIS, 
			@FormDataParam("file") FormDataContentDisposition fileDetail, 
			@FormDataParam("documentId") String documentId) {

	    if (fileDetail ==null || fileIS==null) return Response.status(400).build();


	    
	    System.out.println("======= Upload to mongo =============");
	    System.out.println("documentId:" +documentId);
	    fileDAO.create(fileIS, fileDetail.getFileName(), documentId);
	    System.out.println("======= Upload to local =============");
	    
	    String location ="/Users/AimeTPGM/Downloads/"+fileDetail.getFileName();
	    System.out.println("before write ["+location+"]");
	    writeToFile(fileIS, location );
	    String output = "File saved to  server location : " + location;
	    System.out.println("file written ["+location+"]");
	    return Response.status(200).entity(output).build();
	}
	
	private void writeToFile(InputStream uploadedInputStream,
			String uploadedFileLocation) {

			try {
				OutputStream out = new FileOutputStream(new File(
						uploadedFileLocation));
				int read = 0;
				byte[] bytes = new byte[1024];

				out = new FileOutputStream(new File(uploadedFileLocation));
				while ((read = uploadedInputStream.read(bytes)) != -1) {
					out.write(bytes, 0, read);
				}
				out.flush();
				out.close();
			} catch (IOException e) {

				e.printStackTrace();
			}

		}
	
}