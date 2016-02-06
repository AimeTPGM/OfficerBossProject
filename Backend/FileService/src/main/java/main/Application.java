package main;

import org.jhades.JHades;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import mongodb.main.MongoDBMain;

import java.util.HashSet;
import java.util.Set;

@SpringBootApplication
public class Application {
	public static void main(String[] args) {
		System.out.println("Starting File Service ...");
		MongoDBMain.run();
		System.out.println("Starting Spring Application...");
//		System.out.println(new JHades().overlappingJarsReport());
		SpringApplication.run(Application.class, args);
	}
	
 
}