# User Service

	Service 	|		host	|	Port			
----------------|---------------|--------
	Spring		|	localhost	|  8082
	Mongo		|	localhost	| 27018

# Mongo

	Properties	|	Value
----------------|-----------
DB Name | usertest
COLLECTION | usertestonly

# API


	Path		|	Type	|	Parameter(s)	|	Description
------------------------|-----------|-----------------------|----------
/users	|	GET		| | Return all users
/user|	GET 	|userId=String|get user by {user id}
/deleteUser |	GET 	|userId=String|delete user by {user id}
/newOfficer|	POST |user=JSON|create new officer user
/newBoss|	POST	|user=JSON|create new boss
/login |	POST	|email=String, password=String | login, check password == realPassword.BCrypt if true return user, else return 404
