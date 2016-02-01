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

	
	@GET
	@Path("getusers")
	@Produces(MediaType.APPLICATION_JSON)
	public List<User> getUsers() {
        List<User> users = userDAO.getAllUsers();
        System.out.println("GET Request: get all users");
		return users;
	}
	
	@GET
	@Path("getuser")
	@Produces(MediaType.APPLICATION_JSON)
	public User getUser(
			@QueryParam("userid") String id) {
		System.out.println("GET Request: get user by id "+id);
		return userDAO.readById(id);
	}
	
	@GET
	@Path("deleteuser")
	@Produces(MediaType.APPLICATION_JSON)
	public String deleteUser(
			@QueryParam("userid") String id) {
		System.out.println("GET Request: delete user by id "+id);
		return "deleted "+userDAO.deleteById(id)+" user";
	}
	
	public User newUser(String firstname, String lastname, String email, String password){
		user.setFirstname(firstname);
		user.setLastname(lastname);
		user.setEmail(email);
		user.setPassword(PasswordEncoderGenerator.passwordEncoder(password));
		return user;
	}
	
	@POST
	@Path("newofficer")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public User newOfficer(User u){
		user = new User();
		System.out.println(u.getPasssword());
		user = newUser(u.getFirstname(), u.getLastname(), u.getEmail(), u.getPasssword());
		System.out.println(user.getPasssword());
		user.setUserStatus(new Officer());
		userDAO.create(user);
		return user;
	}
	
	@POST
	@Path("newboss")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public User newBoss(User u){
		user = new User();
		System.out.println(u.getPasssword());
		user = newUser(u.getFirstname(), u.getLastname(), u.getEmail(), u.getPasssword());
		System.out.println(user.getPasssword());
		user.setUserStatus(new Boss());
		userDAO.create(user);
		return user;
	}
	
	@POST
	@Path("login")
	@Consumes(MediaType.APPLICATION_FORM_URLENCODED)
	@Produces(MediaType.APPLICATION_JSON)
	public String simpleLogin(@FormParam("email") String email, 
			@FormParam("password") String password){
		String s="";
		user = userDAO.readByEmail(email);
		s = SimpleAuthentication.passwordMatcher(password, user.getPasssword());
//		user = userDAO.readByEmail(u.getEmail());
//		s = SimpleAuthentication.passwordMatcher(u.getPasssword(), user.getPasssword());
		System.out.println(s);
		return s;
	}

}
