# Review Service

	Service 	|		host	|	Port			
----------------|---------------|--------
	Spring		|	localhost	|  8083
	Mongo		|	localhost	| 27019

# Mongo

	Properties	|	Value
----------------|-----------
DB Name | reviewtest
COLLECTION | reviewtestonly

# API


	Path		|	Type	|	Parameter(s)	|	Description
---------|-----------|---------------|----------
/getreviews	|	GET		| | Return all reviews
/getreviewbydocumentid|	GET 	|documentid=String|get review by {document id}
/getreview	|	GET |reviewwid=String|get review by {review id}
/createreview|	GET	|documentid=String, approverid=String, reviewdesc=String |create new review
/deleteById | GET | id=String | delete review by {review id}
/deleteByDocumentId | GET | documentId=String | delete review by {document id}
