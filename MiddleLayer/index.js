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
/* require async for http in loop*/
var async = require('async');

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

/* set headers */
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8100');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

/* TEST SERVER */
app.get('/', function (req, res) {
	res.send('<h1>Hello Node.js TEST</h1>');
});

/* for all */
// TOTEST
/* @POST
 * login
 * @body:
 *		email
 *		password
 * @return:
 *		[User]
 */
app.post('/login', function (req, res){
	var email = req.body.email;
	var password = req.body.password;
	requestify.post(userServicePath+'login', {
		email: email,
		password: password
	})
	.then(function (response){
		console.log('--- END REQUEST ---');
		res.json(response.getBody());
	})
	.fail(function(){
		console.log('invalid username and password');
		console.log(response.getCode());
		console.log('--- END REQUEST ---')
		res.status(404).send('404 Not Found');		
	});

});

// TOTEST
/* @POST
 * register
 * @body:
 *		user
 * @return:
 *		user
 */
app.post('/register', function (req, res){
	var role = req.body.role;
	var user = req.body.user;

	console.log('=================================')
	console.log('POST REQUEST: '+role+' registration')
	console.log('=================================')

	if (role == 'officer'){
		requestify.post(userServicePath+'newOfficer',{
			user: user;
		})
		.then(function (response){
			console.log('--- END REQUEST ---');
			res.json(response.getBody());
		});
	}
	else if (role == 'boss'){
		requestify.post(userServicePath+'newBoss',{
			user: user;
		})
		.then(function (response){
			console.log('--- END REQUEST ---');
			res.json(response.getBody());
		});
	}
});

// TOTEST
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
	/* Step 1 get approver list */
	requestify.get(approverListServicePath+'approverListByDocumentId?documentId='+docId).then(function (response){
		console.log('✓ approver list')
		finalResponse = response.getBody();
		var approverIdList = response.getBody().approverIdList;
		var reviews = [];

		/* Step 2 get review's of each :approverId of :docId */
		var q = async.queue(function (i) {
			getEachReview(i);
		}, 5);
		var getEachReview = function(i){
			requestify.get(reviewServicePath+'getReviewByDocument?documentId='+docId+'&&approverId='+approverIdList[i]).then(function (response){
				console.log('✓ review by '+approverIdList[i]);
				reviews.push(response.getBody());
				if(i == approverIdList.length-1){
					finalResponse.approverIdList = reviews;
					console.log('--- END REQUEST ---')
					res.json(finalResponse);
				}
			});
		}
		for (var i = 0; i < approverIdList.length; i++) {
			q.push(i);
		};
	});
});

// TOTEST
/* @GET
 * get document detail 
 * @params: 
 *      folderId
 *      docId
 * @return:
 *      finalResponse = [Document, Creator[User], ApproverList[ApproverListId, Review], File, Folder]
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
	requestify.get(documentServicePath+'getDocument?documentId='+docId).then(function (response) {
		console.log('✓ document detail')
		finalResponse = response.getBody();
		/* Step 2 get user information from creator */
		var creatorId = response.getBody().creator;
		requestify.get(userServicePath+'user?userId='+creatorId).then(function (response) {
			console.log('✓ creator detail')
			finalResponse.creator = response.getBody();

			/* Step 3 get approver list from :docId */
			requestify.get(approverListServicePath+'approverListByDocumentId?documentId='+docId).then(function (response) {
				console.log('✓ approver list id')
				var approverIdList = [];
				approverIdList = response.getBody().approverIdList;
				finalResponse.approverList = {};
				finalResponse.approverList.approverListId = response.getBody().id;                          // approverListId => id of this object
				finalResponse.approverList.approverIdList = response.getBody().approverIdList;              // approverIdList => list of approverId
				
				/* Step 4 get all file detail */
				requestify.get(fileServicePath+'allFileDetail?documentId='+docId).then(function (response) {
					console.log('✓ files')
					finalResponse.files = {};
					finalResponse.files = response.getBody();
					
					/* Step 5 get folder detail */
					requestify.get(folderServicePath+'folder?folderId='+folderId).then(function (response){
						console.log('✓ folder detail')
						finalResponse.folder = {};
						finalResponse.folder.folderId = folderId;
						finalResponse.folder.documentList = response.getBody().documentList;

						/* Step 6 get reviews */
						var reviews = [];
						var q = async.queue(function (i) {
							getEachReview(i);
						}, 3);
						var getEachReview = function(i){
							requestify.get(reviewServicePath+'getReviewByDocument?documentId='+docId+'&&approverId='+approverIdList[i]).then(function (response){
								console.log('✓ review by '+approverIdList[i]);
								reviews.push(response.getBody());
								if(i == approverIdList.length-1){
									finalResponse.approverList.approverIdList = reviews;
									
									/* Step 7 get approvers' detail */ 
									for (var i = 0; i < Things.length; i++) {
										Things[i]
									};

									console.log('--- END REQUEST ---')
									res.json(finalResponse);
								}
							});
						}
						for (var i = 0; i < approverIdList.length; i++) {
							q.push(i);
						};
					});
				});
			});
		});
	});
});

// TOTEST
/* for officer */
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
	requestify.get(documentServicePath+'changeApprover?documentId='+docId+'&&approverId='+approverId).then(function (response){
		console.log('✓ changed approver')

	/* Step 2 submit document */
		requestify.get(documentServicePath+'submit?documentId='+docId+'&&versionType='+versionType).then(function (response){
			console.log('✓ submitted document as '+versionType+' update')
			console.log('--- END REQUEST ---')
			res.send();
		});
	});
});

// TOTEST
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
	.then(function (response){
		console.log('✓ created new edit draft')
		var doc = response.getBody();

		/* Step 2 set :docId to editable:false */
		requestify.get(documentServicePath+'editable?documentId='+docId+'&&editable='+editable).then(function (response){
			console.log('✓ changed editable to '+editable)
			
			/* Step 3 add step1.response.documentId to :folderId */
			requestify.get(folderServicePath+'addDocument?folderId='+folderId+'&documentId='+doc.documentId).then(function (response){
				console.log('✓ added this document to folder')

				/* Step 4 copy approver list from :docId to step1.response.documentId */
				requestify.get(approverListServicePath+'copy?copyFrom='+docId+'&copyTo='+doc.documentId).then(function (response){
					var approverList = response.getBody();
					console.log('✓ copied approver list from '+docId+' to '+doc.documentId);
					
					/* Step 5 change step1.response.approverId of step1.response.documentId to step4.approverIdList[0]*/
					requestify.get(documentServicePath+'changeApprover?documentId='+doc.documentId+'&&approverId='+approverList.approverIdList[approverList.currentApproverIndex]).then(function (response){
						
						/* Step 6 submit step1.response.documentId */
						requestify.get(documentServicePath+'submit?documentId='+doc.documentId+'&&versionType='+versionType).then(function (response){
							console.log('✓ submitted document as '+versionType+' update')
							console.log('--- END REQUEST ---')
							res.send();
						});
					});
				});
			});
		});
	});
});

// TOTEST
/* @POST
 * add new 'Draft' document
 * @body:
 *		docName
 *		description
 *		creatorId
 *		approverIdList
 * @return:
 *		[document, folder, approverList]
 */
app.post('/new/draft', function (req, res) {
	var finalResponse = [];
	var docName = req.body.documentName;
	var description = req.body.description;
	var creatorId = req.body.creatorId;
	var approverIdList = req.body.approverIdList;

	console.log('=================================')
	console.log('POST REQUEST: create new \'Draft\' document')
	console.log('=================================')

	/* Step 1 create a new docment status:draft */
	requestify.post(documentServicePath+'newDraft',{
		documentName: docName,
		description: description,
		creatorId: creatorId;
	})
	.then(function (response){
		console.log('✓ created new draft document');
		var doc = request.getBody();
		finalResponse[0] = request.getBody();
		/* Step 2 create folder */
		requestify.post(folderServicePath+'createFolder',{
			folderName: docName,
			creatorId: creatorId
		})
		.then(function (response){
			console.log('✓ created new folder');
			var folder = request.getBody();

			/* Step 3 add Step1.document to Step2.folder */
			requestify.get(folderServicePath+'addDocument?folderId='+folder.id+'&documentId='+doc.documentId).then(function (response){
				console.log('✓ added this document to folder');
				finalResponse[1] = response.getBody();

				/* Step 4 add new approver list */
				requestify.post(approverListServicePath+'addApproverList?documentId='+doc.documentId+'&approverIdList[]='+approverIdList).then(function (response){
					console.log('✓ created new approver list');
					console.log('--- END REQUEST ---')
					finalResponse[2] = response.getBody();
					res.json(finalResponse);
				});
			});
		});
	});
});

// TOTEST
/* @POST
 * save a 'Draft' document
 * @body:
 *
 * @return:
 *		[document, folder, approverlist]
 */
app.post('/save/draft', function (req, res) {
	var finalResponse = [];
	var docId = req.body.documentId;
	var docName = req.body.documentName;
	var description = req.body.description;
	var approverIdList = req.body.approverIdList;

	/* Step 1 update body.document */
	requestify.post(documentServicePath+'save',{
		documentId: docId,
		description: description,
		documentName: docName
	})
	.then(function (response){
		console.log('✓ saved current draft');
		finalResponse[0] = response.getBody;

		/* Step 2 update folder */
		requestify.post(folderServicePath+'update',{
			folderId: folderId,
			folderName: docName
		})
		.then(function (response){
			console.log('✓ updated current folder');
			finalResponse[1] = response.getBody();

			/* Step 3 update approver list */
			requestify.get(approverListServicePath+'update?documentId='+docId+'&approverIdList[]='+approverIdList).then(function (response){
				console.log('✓ updated approver list');
				console.log('--- END REQUEST ---');
				finalResponse[2] = response.getBody();
				res.json(finalResponse);
			});
		});
	});
});

// TOTEST
/* @POST
 * submit a new 'Draft' document
 * @body:
 *		docName
 *		description
 *		creatorId
 *		approverIdList
 *		versionType
 * @return:
 *		none
 */
app.post('/submit/newDraft', function (req, res) {
	var docName = req.body.documentName;
	var description = req.body.description;
	var creatorId = req.body.creatorId;
	var approverIdList = req.body.approverIdList;
	var versionType = req.body.versionType;

	console.log('=================================')
	console.log('POST REQUEST: create and submit new \'Draft\' document')
	console.log('=================================')

	/* Step 1 create a new docment status:draft */
	requestify.post(documentServicePath+'newDraft',{
		documentName: docName,
		description: description,
		creatorId: creatorId;
	})
	.then(function (response){
		console.log('✓ created new draft document');
		var doc = request.getBody();

		/* Step 2 create folder */
		requestify.post(folderServicePath+'createFolder',{
			folderName: docName,
			creatorId: creatorId
		})
		.then(function (response){
			console.log('✓ created new folder');
			var folder = request.getBody();

			/* Step 3 add Step1.document to Step2.folder */
			requestify.get(folderServicePath+'addDocument?folderId='+folder.id+'&documentId='+doc.documentId).then(function (response){
				console.log('✓ added this document to folder');

				/* Step 4 add new approver list */
				requestify.post(approverListServicePath+'addApproverList?documentId='+doc.documentId+'&approverIdList[]='+approverIdList).then(function (response){
					console.log('✓ created new approver list');

					/* Step 5 change step1.document.approverId to step4.approverlist.approverIdList[currentApproverIndex] */
					requestify.get(documentServicePath+'changeApprover?documentId='+doc.documentId+'&&approverId='+approverIdList[0]).then(function (response){
						console.log('✓ changed approver')

						/* Step 6 submit step1.document */
						requestify.get(documentServicePath+'submit?documentId='+doc.documentId+'&&versionType='+versionType).then(function (response){
							console.log('✓ submitted document as '+versionType+' update')
							console.log('--- END REQUEST ---')
							res.send();
						});
					});
				});
			});
		});
	});
});

// TOTEST
/* @POST
 * submit a current 'Draft' document
 * @body:
 *		docId
 *		docName
 *		description
 *		approverIdList
 *		folderId
 * @return:
 *		none
 */
app.post('/submit/updateDraft', function (req, res) {
	var docId = req.body.documentId;
	var docName = req.body.documentName;
	var description = req.body.description;
	var approverIdList = req.body.approverIdList;			// array of id of approvers
	var folderId = req.body.folderId;

	console.log('=================================')
	console.log('POST REQUEST: update and submit current \'Draft\' document')
	console.log('=================================')

	/* Step 1 update body.document */
	requestify.post(documentServicePath+'save',{
		documentId: docId,
		description: description,
		documentName: docName
	})
	.then(function (response){
		console.log('✓ saved current draft');

		/* Step 2 update folder */
		requestify.post(folderServicePath+'update',{
			folderId: folderId,
			folderName: docName
		})
		.then(function (response){
			console.log('✓ updated current folder');

			/* Step 3 update approver list */
			requestify.get(approverListServicePath+'update?documentId='+docId+'&approverIdList[]='+approverIdList).then(function (response){
				console.log('✓ updated approver list');
				
				/* Step 4 change step1.document.approverId to step4.approverlist.approverIdList[currentApproverIndex] */
					requestify.get(documentServicePath+'changeApprover?documentId='+docId+'&&approverId='+approverIdList[0]).then(function (response){
						console.log('✓ changed approver')

						/* Step 5 submit step1.document */
						requestify.get(documentServicePath+'submit?documentId='+docId+'&&versionType='+versionType).then(function (response){
							console.log('✓ submitted document as '+versionType+' update')
							console.log('--- END REQUEST ---')
							res.send();
						});
					});
			});
		});
	});
});

// TOTEST
/* @POST
 * upload a file
 * @body:
 *		file
 *		docId
 * @return:
 *		none
 */
app.post('/upload', function (req, res){
	var file = req.body.file;
	var docId = req.body.documentId;

	console.log('=================================')
	console.log('POST REQUEST: upload a file')
	console.log('=================================')

	/* Step 1 upload a file to document */
	requestify.post(fileServicePath+'upload',{
		file: file,
		documentId: documentId
	}).then(function (response){
		console.log('✓ upload a file')
		res.send();
	});
});

// TOTEST
/* @GET
 * delete all document and related data in specific folder
 * @params:
 *		folderId
 * @return
 *		none
 */
app.get('/delete/:folderId', function (req, res) {
	var folderId = req.params.folderId;

	console.log('=================================')
	console.log('GET REQUEST: delete all data in specific folder')
	console.log('=================================')

	//TODO
	/* Step 1 get all document from body.folderId */
	requestify.get(folderServicePath+'folder?folderId='+folderId).then(function (response){
		var folder = response.getBody();
		var docList = response.getBody().documentIdList;
		console.log('✓ get folder data');
		
		for (var i = 0; i < docList.length; i++) {

			/* Step 2 delete all review of each document */
			requestify.get(reviewServicePath+'deleteByDocumentId?documentId='+docList[i]).then(function (response){
				console.log('✓ delete reviews of document: '+docList[i]);
			});

			/* Step 3 delete all files of each document */
			requestify.get(fileServicePath+'deleteAllByDocumentId?documentId='+docList[i]).then(function (response){
				console.log('✓ delete files of document: '+docList[i]);
			});

			/* Step 4 delete approver list of each document */
			requestify.get(approverListServicePath+'deleteByDocumentId?documentId='+docList[i]).then(function (response){
				console.log('✓ delete approver list of document: '+docList[i]);
			});
		};

		/* Step 5 delete all document in the folder */
		for (var i = 0; i < docList.length; i++) {
			requestify.get(documentServicePath+'delete?documentId='+docList[i]).then(function (response){
				console.log('✓ delete document: '+docList[i]);
			});
		};

		/* Step 6 delete folder */
		requestify.get(folderServicePath+'deleteById?folderId='+folderId).then(function (response){
			console.log('✓ delete folder: '+folderId);
			res.send();
		});
	});
});

// TOTEST
// TODO
/* @GET
 * document list
 * @params
 *
 * @return
 *
 */
app.get('/doclist/officer/:userId', function (req, res){
	var userId = req.params.userId;
	var finalResponse = [];

	console.log('=================================')
	console.log('GET REQUEST: document list for officer: '+userId)
	console.log('=================================')

	/* Step 1 get folders those are created by userId */
	requestify.get(folderServicePath+'getFolderByCreatorId?creatorId='+userId).then(function (response){
		console.log('✓ get folders: '+docId);
		finalResponse = folders;

		/* Step 2 get documents for last document id */
		var folders = response.getBody();

		var q = async.queue(function (docId, i) {
			getEachDocument(docId, i);
		}, 3);
		var getEachDocument = function(docId, i){
			requestify.get(documentServicePath+'getDocument?documentId='+docId).then(function (response){
				console.log('✓ get document: '+docId);
				finalResponse[i].lastDocData = [];
				finalResponse[i].lastDocData.push(response.getBody());
				if(i == folders.length-1){
					console.log('--- END REQUEST ---')
					res.json(finalResponse);
				}
			});
		}
		for (var i = 0; i < folders.length; i++) {
			var index = folders[i].documentList.length - 1;
			var id = folders[i].documentList[index];
			q.push(id, i);
		};
	});
});

// TOTEST
// TODO
/* @GET
 * history (folder)
 *
 *
 *
 */
app.get('/history/:folderId', function (req, res){
	var folderId = req.params.folderId;
	var finalResponse = [];
	requestify.get(folderServicePath+'folder?folderId='+folderId).then(function (response){
		finalResponse = response.getBody();

		/* Step 2 get documents for last document id */
		var folder = response.getBody();

		var q = async.queue(function (i) {
			getEachDocument(i);
		}, 3);
		var getEachDocument = function(i){
			requestify.get(documentServicePath+'getDocument?documentId='+folder.documentList[i]).then(function (response){
				console.log('✓ get document: '+folder.documentList[i]);
				finalResponse[i].folder.documentList[i].push(response.getBody());
				if(i == folders.length-1){
					console.log('--- END REQUEST ---')
					res.json(finalResponse);
				}
			});
		}
		for (var i = 0; i < folder.documentList.length; i++) {
			q.push(i);
		};

	});
});

/* for boss */
// TOTEST
// TODO
/* @GET
 * document list for boss
 *
 *
 *
 */

// TOTEST
// TODO
/* @GET
 * approve
 *
 *
 *
 */

// TOTEST
// TODO
/* @GET
 * reject
 *
 *
 *
 */
