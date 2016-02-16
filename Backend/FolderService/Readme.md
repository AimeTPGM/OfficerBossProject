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
/getFolderByCreatorId |	GET | creatorId=String | Return folder by {creator id}
/createFolder |	GET 	| folderName=String, creatorId=String | create new folder
/update |	POST	| folderId=String, folderName=String | change folder name
/addDocument|	GET 	|id=String, documentId=String|add new document by {document id} to folder {id}
/deleteDocument	|	GET	|folderId=String, documentId=String|delete document by {document id}
/deleteById	 |	GET	|file=file, documentid=String|delete folder by {folder id}
/complete |	GET 	| folderId=String | change folder: {folder id} status to Completed
/unpublished |	GET 	| folderId=String | change folder: {folder id} status to Unpublished
