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
/publishDocuments	|	GET		| documentId=String | Return publish document by {document id}
/unpublished		|	GET 	|documentId=String  | remove publish document by {document id}
