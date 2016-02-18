package main;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Application {
	public static void main(String[] args) {
		System.out.println("Starting Folder Service ...");
//		MongoDBMain.run();
		System.out.println("Starting Spring Application...");
		SpringApplication.run(Application.class, args);
	}
}