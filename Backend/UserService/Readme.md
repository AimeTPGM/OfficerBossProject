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
/getusers	|	GET		| | Return all users
/getuser|	GET 	|userid=String|get user by {user id}
/newofficer|	POST |user=JSON|create new officer user
/newboss|	POST	|user=JSON|create new boss
