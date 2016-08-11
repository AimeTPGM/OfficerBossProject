/* load Express.js */
var app = require('express')();
 
/* working on port 7777 */
var port = process.env.PORT || 7777;

/* require for requestify */
var requestify = require('requestify');

/* path of services */
var documentServicePath = "http://localhost:8081/";
var userServicePath = "http://localhost:8082/";
var reviewServicePath = "http://localhost:8083/"
var fileServicePath = "http://localhost:8084/";
var folderServicePath = "http://localhost:8085/";
var publishDocumentServicePath = "http://localhost:8086/";
var approverListServicePath = "http://localhost:8087/";

/* run Web Server on port */
app.listen(port, function() {
    console.log('Starting node.js on port ' + port);
});



/* Routing */
app.get('/', function (req, res) {
    res.send('<h1>Hello Node.js</h1>');
});

/* officer */
/*
 * get document detail 
 * params: 
 *		folderId
 *		documentId
 */ 

 /* finalResponse = [Document, Creator, ApproverListId, ApproverList, ]
 */
app.get('/documentDetail/:docId', function (req, res) {
	console.log('GET REQUEST: get all users from user service')
	var finalResponse = [];
	var docId = req.params.docId;
	/* Step 1 get document detail from docId */
	requestify.get(documentServicePath+'getDocument?documentId='+docId).then(function(response) {
    	finalResponse = response.getBody();

    	/* Step 2 get user information from creator */
    	var creatorId = response.getBody().creator;
    	requestify.get(userServicePath+'user?userId='+creatorId).then(function(response) {
	    	finalResponse.creator = response.getBody();
	    	
	    	/* Step 3 get approver list from approverId */
	    	requestify.get(approverListServicePath+'approverListByDocumentId?documentId='+docId).then(function(response) {
	    		finalResponse.approverId = response.getBody();
	    		
	    		/* Step 4 get each approver detail from approver list service*/
	    		for (var i = 0; i < res.getBody().length; i++) {
	    			
	    		};

	    	});
	    	
		});
	});
});
