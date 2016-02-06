package main.rest;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import javax.inject.Named;
import javax.ws.rs.Consumes;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataParam;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;



@Named
@Path("/")
public class UploadFileService {


	@POST
    @Path("/upload")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
	public Response uploadFile( @FormDataParam("file") InputStream fileIS,   @FormDataParam("file") FormDataContentDisposition fileDetail ) {

	    if (fileDetail ==null || fileIS==null) return Response.status(400).build();


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