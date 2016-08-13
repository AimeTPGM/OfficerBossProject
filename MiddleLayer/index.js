/* load Express.js */
var app = require('express')();
 
/* working on port 7777 */
var port = process.env.PORT || 7777;

/* libraries */
/* require for requestify */
var requestify = require('requestify');
/* require for body parser for parse request body*/
var bodyParser = require('body-parser');
// parse application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

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

/* for all */
/* @GET
 * get review by document id and approver id
 * @params: 
 *      approverListId
 *      docId
 * @return:
 *		Review
 */
app.get('/review/:docId/:approverListId', function (req, res){
	var finalResponse = [];
	var docId = req.params.docId;
	var approverListId = req.params.approverListId;

	console.log('=================================')
	console.log('GET REQUEST: get reviews')
	console.log('=================================')
	console.log('document id: '+docId)
	console.log('approver list id id: '+approverListId)
	console.log('=================================')

	requestify.get(approverListServicePath+'approverListByDocumentId?documentId='+docId).then(function(response){
		console.log('✓ approver list')
		finalResponse = response.getBody();
		var approverIdList = response.getBody().approverIdList;
		var getEachReview = function(i){
			requestify.get(reviewServicePath+'getReviewByDocument?documentId='+docId+'&&approverId='+approverIdList[i]).then(function(response){
				console.log('✓ review by '+approverIdList[i]);
				finalResponse.approverIdList[i] = response.getBody();
			});
		}

		for (var i = 0; i < approverIdList.length; i++) {
			getEachReview(i);
			if(i == approverIdList.length - 1) res.json(finalResponse)
		};

		
		
		

	});
	
	// requestify.get(reviewServicePath+'getReviewByDocument?documentId='+docId+'&&approverId='+approverId).then(function(response){
	// 	res.json(response.getBody());
	// });
});

/* for officer */
/* @GET
 * get document detail 
 * @params: 
 *      folderId
 *      docId
 * @return:
 *      finalResponse = [Document, Creator, ApproverListId, File, Folder]
 */
app.get('/documentDetail/:folderId/:docId', function (req, res) {
	var finalResponse = [];
	var docId = req.params.docId;
	var folderId = req.params.folderId;

	console.log('=================================')
	console.log('GET REQUEST: get document detail')
	console.log('=================================')
	console.log('document id: '+docId)
	console.log('folder id: '+folderId)
	console.log('=================================')
	
	/* Step 1 get document detail from docId */
	requestify.get(documentServicePath+'getDocument?documentId='+docId).then(function(response) {
		console.log('✓ document detail')
		finalResponse = response.getBody();
	/* Step 2 get user information from creator */
		var creatorId = response.getBody().creator;
		requestify.get(userServicePath+'user?userId='+creatorId).then(function(response) {
			console.log('✓ creator detail')
			finalResponse.creator = response.getBody();

	/* Step 3 get approver list from :docId */
			requestify.get(approverListServicePath+'approverListByDocumentId?documentId='+docId).then(function(response) {
				console.log('✓ approver list id')
				finalResponse.approverList = {};
				finalResponse.approverList.approverListId = response.getBody().id;                          // approverListId => id of this object
				finalResponse.approverList.approverIdList = response.getBody().approverIdList;              // approverIdList => list of approverId
				
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

					});
				});
			});
		});
	});
});

/* @POST
 * submit 'Draft' document
 * @Content-Type:
 *      x-www-form-urlencoded
 * @body: 
 *      docId
 *      approverId
 *      versionType
 * @return:
 *      none
 */
app.post('/submit/draft', function (req, res) {
	var docId = req.body.docId;
	var approverId = req.body.approverId;
	var versionType = req.body.versionType;

	console.log('=================================')
	console.log('POST REQUEST: submit \'Draft\' document as '+versionType+'update')
	console.log('=================================')
	console.log('document id: '+docId)
	console.log('approver id: '+approverId)
	console.log('=================================')

	/* Step 1 change current document approver to :approverId */
	requestify.get(documentServicePath+'changeApprover?documentId='+docId+'&&approverId='+approverId).then(function(response){
		console.log('✓ changed approver')

	/* Step 2 submit document */
		requestify.get(documentServicePath+'/submit?documentId='+docId+'&&versionType='+versionType).then(function(response){
			console.log('✓ submitted document as '+versionType+' update')
			console.log('--- END REQUEST ---')
			res.send();
		});
	});
});

/* @POST
 * re-submit 'Reject' document
 * @Content-Type:
 *      x-www-form-urlencoded
 * @body: 
 *      doc
 *          docId
 *          documentName
 *          description
 *      others
 *          folderId
 *          versionType
 *          approverId
 *			editable
 * @return:
 *      none
 */
app.post('/submit/reject', function (req, res) {
	var docId = req.body.docId;
	var docName = req.body.documentName;
	var description = req.body.description;
	var approverListId = req.body.approverListId;
	var versionType = req.body.versionType;
	var editable = req.body.editable;
	var folderId = req.body.folderId;

	console.log('=================================')
	console.log('POST REQUEST: re-submit \'Reject\' document')
	console.log('=================================')

	/* Step 1 create new edit draft */
	requestify.post(documentServicePath+'newEditDraft',{
		documentName: docName, 
        description: description, 
        documentId: docId
	})
	.then(function(response){
		var doc = response.getBody();

		/* Step 2 set :docId to editable:false */
		requestify.get(documentServicePath+'editable?documentId='+docId+'&&editable='+editable).then(function(response){

			/* Step 3 add step1.response.documentId to :folderId */
			requestify.get(folderServicePath+'addDocument?folderId='+folderId+'&documentId='+doc.documentId).then(function(response){
				/* Step 4 copy approver list from :docId to step1.response.documentId */
				/* Step 5 change step1.response.approverId of step1.response.documentId to step4.approverIdList[0]*/
				/* Step 6 submit step1.response.documentId */
				console.log('--- END REQUEST ---')
				res.send();
			});
		});
	});
});