package main.rest;

import java.util.ArrayList;
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

import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.web.client.RestTemplate;

import main.model.User;
import main.rest.userstatus.Boss;
import main.rest.userstatus.Officer;
import mongodb.dao.UserDAO;
import security.crypto.PasswordEncoderGenerator;
import security.crypto.SimpleAuthentication;

@Named
@Path("/")
public class UserRest {
	private ClassPathXmlApplicationContext ctx = new ClassPathXmlApplicationContext("spring.xml");
	private static List<User> users = new ArrayList<User>();
	private User user;
	private UserDAO userDAO = ctx.getBean("userDAO", UserDAO.class);
	
	@Inject
	private RestTemplate restTemplate;
	
	public Response okStatus(Object obj){
		return Response.status(200).entity(obj).build();
	}
	
	public Response notFoundStatus(Object obj){
		return Response.status(404).entity(obj).build();
	}
	
	
	@GET
	@Path("getusers")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getUsers() {
        List<User> users = userDAO.getAllUsers();
        System.out.println("GET Request: get all users");
		return okStatus(users);
	}
	
	@GET
	@Path("getuser")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getUser(
			@QueryParam("userid") String id) {
		System.out.println("GET Request: get user by id "+id);
		user = userDAO.readById(id);
		if (user == null) return notFoundStatus("404 User not Found");
		return okStatus(user);
	}
	
	@GET
	@Path("deleteuser")
	@Produces(MediaType.APPLICATION_JSON)
	public Response deleteUser(
			@QueryParam("userid") String id) {
		System.out.println("GET Request: delete user by id "+id);
		int temp = userDAO.deleteById(id);
		return okStatus("Deleted!");
	}

	@POST
	@Path("newofficer")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response newOfficer(User u){
		
		user = new User(u.getFirstname(), u.getLastname(), u.getEmail(),PasswordEncoderGenerator.passwordEncoder(u.getPasssword()),new Officer());
		userDAO.create(user);
		return okStatus(user);
	}
	
	@POST
	@Path("newboss")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response newBoss(User u){
		user = new User(u.getFirstname(), u.getLastname(), u.getEmail(),PasswordEncoderGenerator.passwordEncoder(u.getPasssword()),new Boss());
		userDAO.create(user);
		return okStatus(user);
	}
	
	@POST
	@Path("login")
	@Consumes(MediaType.APPLICATION_FORM_URLENCODED)
	@Produces(MediaType.APPLICATION_JSON)
	public Response simpleLogin(@FormParam("email") String email, 
			@FormParam("password") String password){
		user = userDAO.readByEmail(email);
		String temp = SimpleAuthentication.passwordMatcher(password, user.getPasssword());
		return okStatus(temp);
	}

}
