package main.model;

import java.io.InputStream;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.springframework.data.annotation.Id;

public class MyFile {
	@Id
	private String id;
	private String filename;
	private InputStream inputStream;
	private String documentId;
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getFilename() {
		return filename;
	}
	public void setFilename(String filename) {
		this.filename = filename;
	}
	public String getDocumentId() {
		return documentId;
	}
	public void setDocumentId(String documentId) {
		this.documentId = documentId;
	}
	
	public void setInputStream(InputStream inputStream){
		this.inputStream = inputStream;
	}
	public InputStream getInputStream(){
		return inputStream;
	}
	
	
}
