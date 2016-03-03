package main.model;

import java.io.InputStream;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.springframework.data.annotation.Id;

public class MyFile extends MyFileWithoutIS {
	
	private InputStream inputStream;
	
	public void setInputStream(InputStream inputStream){
		this.inputStream = inputStream;
	}
	public InputStream getInputStream(){
		return inputStream;
	}
	
	
}
