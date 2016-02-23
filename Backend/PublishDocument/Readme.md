# Publish Document Service

	Service 	|		host	|	Port			
----------------|---------------|--------
	Spring		|	localhost	|  8086
	Mongo		|	localhost	| 27022

# Mongo

	Properties	|	Value
----------------|-----------
DB Name | publishdocumenttest
COLLECTION | publishdocumenttestonly

# API


	Path		|	Type	|	Parameter(s)	|	Description
---------|-----------|---------------|----------
/publishDocuments	|	GET		| | Return all publish documents
/publishDocument	|	GET		| documentId=String | Return publish document by {document id}
/addPublishDocument	|	GET 	| documentId=String, documentName=String | add document to publish document list
/unpublished		|	GET 	|documentId=String  | remove publish document by {document id}
