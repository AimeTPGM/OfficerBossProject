package main.rest;

import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;
import javax.inject.Named;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.springframework.web.client.RestTemplate;

import main.model.File;


@Named
@Path("/")
public class FileRest {
	private List<File> files = new ArrayList<File>();
	
	@Inject
	private RestTemplate restTemplate;
	
	@GET
	@Path("getallfiles")
	@Produces(MediaType.APPLICATION_JSON)
	public List<File> getReviewByDocumentId() {
		//TODO DAO to get all file
		return files;
	}
}
