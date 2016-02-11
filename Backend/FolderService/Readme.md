# Folder Service

	Service 	|		host	|	Port			
----------------|---------------|--------
	Spring		|	localhost	|  8085
	Mongo		|	localhost	| 27021

# Mongo

	Properties	|	Value
----------------|-----------
DB Name | foldertest
COLLECTION | foldertestonly

# API


	Path		|	Type	|	Parameter(s)	|	Description
------------|-----------|-------------|----------
/folders|	GET		| | Return all folders
/folder	|	GET |folderId=String| Return folder by {folder id}
/addDocument|	GET 	|documentId=String|add new document by {document id}
/deleteDocument	|	GET	|documentId=String|delete document by {document id}
/deleteById	 |	GET	|file=file, documentid=String|delete folder by {folder id}

