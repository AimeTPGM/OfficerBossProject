package main;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import jersey.repackaged.com.google.common.collect.Iterables;
import mongodb.main.MongoDBMain;

@SpringBootApplication
public class Application {
	public static void main(String[] args) {
		System.out.println("Starting Document Service ...");
		System.out.println(Iterables.class.getProtectionDomain().getCodeSource().getLocation());
		MongoDBMain.run();
		System.out.println("Starting Spring Application...");
		SpringApplication.run(Application.class, args);
	}
}