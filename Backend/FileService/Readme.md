# File Service

	Service 	|		host	|	Port			
----------------|---------------|--------
	Spring		|	localhost	|  8084
	Mongo		|	localhost	| 27020

# API


	Path		|	Type	|	Parameter(s)	|	Description
------------------------|-----------|-----------------------|----------
/files		|	GET		| | Return all files
/delete			|	GET |id=String|delete file by {file id}
/deletebydocid|	GET 	|documentid=String|delete file by {document id}
/download	 |	GET	|documentid=String|download file by {document id}
/upload	 	|	POST	|file=file, documentid=String|upload file

