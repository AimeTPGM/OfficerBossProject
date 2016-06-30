# Approver List Service

	Service 	|		host	|	Port			
----------------|---------------|--------
	Spring		|	localhost	|  8087
	Mongo		|	localhost	| 27023

# Mongo

	Properties	|	Value
----------------|-----------
DB Name | approverlisttest
COLLECTION | approverlisttestonly

# API


	Path		|	Type	|	Parameter(s)	|	Description
---------|-----------|---------------|----------
/approverLists	|	GET		| | Return all approver lists
/approverList	|	GET		| documentId=String | Return approver id list by {approver list id}
/approverListByDocumentId	|	GET		| documentId=String | Return approver list by {document id}
/addApproverList	|	GET 	| documentId=String, approverIdList=List<String> | add new approver list
