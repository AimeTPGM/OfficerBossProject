package database.mysql;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import database.dao.DatabaseModel;

public class MySQLDBMain implements DatabaseModel{
	 private static final String DB_NAME = "reviewtest";
	 private static final String TABLE = "reviewtestonly";
	 private ApplicationContext ctx = null;
	 public void run(){
		 
	 }

	public ApplicationContext getContext() {
		if (ctx == null){
			ctx = new ClassPathXmlApplicationContext("mysql/Spring-MySQL.xml");
		}
		
		return ctx;
	}
}
