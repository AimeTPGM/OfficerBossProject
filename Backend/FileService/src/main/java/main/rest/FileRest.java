package main.rest;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;
import javax.inject.Named;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsOperations;
import org.springframework.web.client.RestTemplate;

import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;
import com.mongodb.gridfs.GridFSDBFile;

import main.model.File;
import mongodb.main.SpringMongoConfig;


@Named
@Path("/")
public class FileRest {
	private List<File> files = new ArrayList<File>();
	
	AnnotationConfigApplicationContext ctx = 
            new AnnotationConfigApplicationContext(SpringMongoConfig.class);
GridFsOperations gridOperations = 
             (GridFsOperations) ctx.getBean("gridFsTemplate");

	
	@Inject
	private RestTemplate restTemplate;
	
	@GET
	@Path("getallfiles")
	@Produces(MediaType.APPLICATION_JSON)
	public List<File> getReviewByDocumentId() {
		//TODO DAO to get all file
		return files;
	}
	
	@GET
	@Path("upfile")
	@Produces(MediaType.APPLICATION_JSON)
	public String uploadFile() {
		InputStream inputStream = null;
		DBObject metaData = new BasicDBObject();
		metaData.put("extra1", "anything 1");
		metaData.put("extra2", "anything 2");
		try {
			inputStream = new FileInputStream("/Users/AimeTPGM/Desktop/testing.png");
			gridOperations.store(inputStream, "testing.png", "image/png", metaData);

		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} finally {
			if (inputStream != null) {
				try {
					inputStream.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}

			System.out.println("Done");
		return "uploaded";
	}
	
	@GET
	@Path("downloadfile")
	@Produces(MediaType.APPLICATION_JSON)
	public String downloadFile() {
		List<GridFSDBFile> result = gridOperations.find(
	               new Query().addCriteria(Criteria.where("filename").is("testing.png")));

		for (GridFSDBFile file : result) {
			try {
				System.out.println(file.getFilename());
				System.out.println(file.getContentType());
					
				//save as another image
				file.writeTo("/Users/AimeTPGM/Downloads/new-testing.png");
			} catch (IOException e) {
				e.printStackTrace();
			}
		}

		System.out.println("Done");
		return "downloaded";
	}
}
