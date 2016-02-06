# Review Service

	Service 	|		host	|	Port			
----------------|---------------|--------
	Spring		|	localhost	|  8083
	Mongo		|	localhost	| 27019

# API


	Path		|	Type	|	Parameter(s)	|	Description
------------------------|-----------|-----------------------|----------
/getreviews	|	GET		| | Return all reviews
/getreviewbydocumentid|	GET 	|documentid=String|get review by {document id}
/getreview	|	GET |reviewwid=String|get review by {review id}
/createreview|	GET	|documentid=String, approverid=String, reviewdesc=String |create new review


