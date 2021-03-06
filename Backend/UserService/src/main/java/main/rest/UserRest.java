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
	@Path("users")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getUsers() {
        List<User> users = userDAO.getAllUsers();
        System.out.println("GET Request: get all users");
		return okStatus(users);
	}
	
	@GET
	@Path("user")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getUser(
			@QueryParam("userId") String id) {
		System.out.println("GET Request: get user by id "+id);
		user = userDAO.readById(id);
		if (user == null) return notFoundStatus("404 User not Found");
		return okStatus(user);
	}
	
	@GET
	@Path("deleteUser")
	@Produces(MediaType.APPLICATION_JSON)
	public Response deleteUser(
			@QueryParam("userid") String id) {
		System.out.println("GET Request: delete user by id "+id);
		int temp = userDAO.deleteById(id);
		return okStatus("Deleted!");
	}
	
	@GET
	@Path("getBosses")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getBosses() {
		System.out.println("GET Request: get bosses");
		users = userDAO.getUserByRole("Boss");
		return okStatus(users);
	}
	
	@GET
	@Path("getOfficers")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getOfficers() {
		System.out.println("GET Request: get officers");
		users = userDAO.getUserByRole("Officer");
		return okStatus(users);
	}

	@POST
	@Path("newOfficer")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response newOfficer(User u){
		
		user = new User(u.getFirstname(), u.getLastname(), u.getEmail(),PasswordEncoderGenerator.passwordEncoder(u.getPasssword()),new Officer());
		userDAO.create(user);
		return okStatus(user);
	}
	
	@POST
	@Path("newBoss")
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
		if (user == null){
			return notFoundStatus("incoorect Email or Password");
		}
		boolean temp = SimpleAuthentication.passwordMatcher(password, user.getPasssword());
		if (temp){
			System.out.println("password matched!");
			return okStatus(user);
		}
		else{
			System.out.println("password unmatched :(");
			return notFoundStatus("incoorect Email or Password");
					
		}
		
	}

}
