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
/getReviews	|	GET		| | Return all reviews
/getReviewsByDocumentId|	GET 	|documentId=String|get review by {document id}
/getReview	|	GET |reviewId=String|get review by {review id}
/createReview|	GET	|documentId=String, approverId=String, reviewDesc=String |create new review
/deleteById | GET | id=String | delete review by {review id}
/deleteByDocumentId | GET | documentId=String | delete review by {document id}
