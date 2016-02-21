# File Service

	Service 	|		host	|	Port			
----------------|---------------|--------
	Spring		|	localhost	|  8084
	Mongo		|	localhost	| 27020

# Mongo

	Properties	|	Value
----------------|-----------
DB Name | filetest
COLLECTION | filetestonly

# API


	Path		|	Type	|	Parameter(s)	|	Description
------------------------|-----------|-----------------------|----------
/files		|	GET		| | Return all files
/delete			|	GET |id=String|delete file by {file id}
/deleteByDocumentId|	GET 	|documentId=String|delete file by {document id}
/download	 |	GET	|documentId=String|download file by {document id}
/upload	 	|	POST	|file=file, documentId=String|upload file

