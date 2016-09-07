# app.js

State | Path | templateUrl | Controller
----|----|----|----
login | /login | templates/login.html | LoginCtrl
register | /register | templates/register.html | 
forgotpw | /forgotpw | templates/forgotpw.html | ForgotPasswordCtrl
app | /app | templates/menu.html | AppCtrl
app.doc | /doc | templates/doclist.html | DocumentListCtrl
app.history | /doc/:folderId/history | templates/history.html | HistoryCtrl
app.doclistforboss | /doclistforboss | templates/boss/doclist.html | DocumentListForBossCtrl
app.newdoc | /doc/:folderId/new | templates/adddoc.html | AddNewDocumentCtrl
app.editdoc | /doc/:folderId/:docId/edit | templates/editdoc.html | EditDocumentCtrl
app.docdetail | /doc/:folderId/:docId | templates/docdetail.html | DocumentDetailCtrl
app.review | /doc/:folderId/:docId | templates/review.html | DocumentReviewCtrl
app.dashboard | /dashboard | templates/dashboard.html | 
app.file | /file | templates/testAddfile.html | FileCtrl

# controller.js

## Directives

directive | value | Description
----|----|----
showWhen | large, small | for responsive web development

## Services

### Document Service

method | parameter(s) | implemented?
----|----|----
newdraft | | no
newdoc | docName, docDesc, creatorId | yes
updateNoNewFile | docName, docDesc, creatorId, docId, folderId | yes
updateWithNewFile | | no
save | docId, docName, docDesc | yes
submit | docId | yes
delete | docId | yes
publish | docId | yes

### Review Service

method | parameter(s) | implemented?
----|----|----
getReview | | no
approve | docId, approverId, reviewText | yes
reject | docId, approverId, reviewText | yes

### File Service

method | parameter(s) | implemented?
----|----|----
upload | file, docId | yes
getFileDetail | docId | yes - but broken
download | docId | yes
delete | docId | yes
copy | docId | yes

### Folder Service

method | parameter(s) | implemented?
----|----|----
newFolder | folderName, creatorId | yes
delete | folderId | yes
update | folderId, folderName | yes
addDocument | folderId, docId | yes
deleteDocument | folderId, docId | yes
complete | folderId | yes
unpublished | folderId | yes
