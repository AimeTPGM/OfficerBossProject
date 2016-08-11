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



/* TEST SERVER */
app.get('/', function (req, res) {
    res.send('<h1>Hello Node.js TEST</h1>');
});

/* officer */
/*
 * get document detail 
 * @params: 
 *		folderId
 *		documentId
 * @return:
 * 		finalResponse = [Document, Creator, ApproverListId, File, Folder]
 */
app.get('/documentDetail/:folderId/:docId', function (req, res) {
	console.log('=================================')
	console.log('GET REQUEST: get document detail')
	console.log('=================================')
	var finalResponse = [];
	var docId = req.params.docId;
	var folderId = req.params.folderId;
	/* Step 1 get document detail from docId */
	requestify.get(documentServicePath+'getDocument?documentId='+docId).then(function(response) {
    	console.log('✓ document detail')
    	finalResponse = response.getBody();
    	/* Step 2 get user information from creator */
    	var creatorId = response.getBody().creator;
    	requestify.get(userServicePath+'user?userId='+creatorId).then(function(response) {
	    	console.log('✓ creator detail')
	    	finalResponse.creator = response.getBody();
	    	finalResponse.creatorresponse.getBody() = response.getBody().firstname;
	    	finalResponse.creator.lastname = response.getBody().lastname;
	    	finalResponse.creator.name = response.getBody().name;
	    	finalResponse.creator.email = response.getBody().email;
	    	finalResponse.creator.userId = response.getBody().userId;

	    	/* Step 3 get approver list from approverId */
	    	requestify.get(approverListServicePath+'approverListByDocumentId?documentId='+docId).then(function(response) {
	    		console.log('✓ approver list id')
	    		finalResponse.approverId = response.getBody().approverIdList;
	    		
	    		/* Step 4 get all file detail */
	    		requestify.get(fileServicePath+'allFileDetail?documentId='+docId).then(function(response) {
	    			console.log('✓ files')
	    			finalResponse.files = {};
	    			finalResponse.files = response.getBody();
	    			
	    			/* Step 5 get folder detail */
	    			requestify.get(folderServicePath+'folder?folderId='+folderId).then(function(response){
	    				console.log('✓ folder detail')
	    				finalResponse.folder = {};
	    				finalResponse.folder.folderId = folderId;
	    				finalResponse.folder.documentList = response.getBody().documentList;
	    				console.log('--- END REQUEST ---')
	    				res.json(finalResponse)

	    			})

	    		});
	    	});
		});
	});
});
