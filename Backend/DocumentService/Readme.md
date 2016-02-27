# Document Service

Document Service|		host	|	Port			
----------------|---------------|--------
	Spring		|	localhost	|  8081
	Mongo		|	localhost	| 27018

# Mongo

	Properties	|	Value
----------------|-----------
DB Name | documenttest
COLLECTION | documenttestonly

# API


		Path			|	Type	|		Parameter(s)	|	Description
------------------------|-----------|-----------------------|----------
/getDocuments		|	GET		| |Return all documents
/getDocument			|	GET 	|documentId=String|Return document by {document id}
/getDocumentsByUserId|	GET 	|userid=String|Return document by {userid}
/newDraft	 			|	POST	|documentName=String, description=String, creator=String|create new draft
/newDocument			|	GET 	|documentName=String, description=String, creator=String|create new document, status = Waiting for Approval
/save					|	GET 	|documentId=String, documentName=String, description=String| update document, status = current status
/submit					|	GET 	|documentId=String, versionType=String("minor" || "major")| submit document, status = Waiting for Approval, update document version
/approve				|	GET 	|documentId=String| approve document, status = Approve
/publish				|	GET 	|documentId=String| publish document, status = Publish
/reject					|	GET 	|documentId=String| reject document, status = Reject
/delete					|	GET 	|documentId=String| delete
/newEditDraft			|	POST	|documentName=String, description=String, documentId=String| create new draft for edit document from reject document
/unpublished			| 	GET 	|documentId=String|	unpublished the document {document id} change status to Approved