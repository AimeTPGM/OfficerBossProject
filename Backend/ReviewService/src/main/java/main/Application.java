package main;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import database.dao.DatabaseModel;
import database.mongodb.MongoDBMain;
import database.mysql.MySQLDBMain;

@SpringBootApplication
public class Application {
	public static DatabaseModel database;
	public static void main(String[] args) {
		System.out.println("Starting Review Service ...");
		// use mongo db
//		database = new MongoDBMain();
		
		// use mysql
		database = new MySQLDBMain();
		
		// run database
		database.run();
		System.out.println("Starting Spring Application...");
		SpringApplication.run(Application.class, args);
	}
}