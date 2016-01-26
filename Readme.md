# Frontend

ionic framework

download and install: http://ionicframework.com

NOTE: requires nodejs

change directory to ~/whatever/OfficerBossProject/Frontend

> cd ~/whatever/OfficerBossProject/OfficerBossFrontend

run ionic server

> $ ionic serve 

# Backend
## MongoDB

download and install: https://www.mongodb.org

there is no data in ~/whatever/AllService/data yet because the size exceeds GitHub limit

change directory to ~/whatever/AllService/data, example

> cd ~/whatever/DocumentService/data

NOTE: /data folder will not be able to be uploaded to github because of size limitation, please copy and paste OfficerBossProject to another directory before moving to the next step

run mongo database for each service using command below

> mongod --dbpath ~/whatever/WhateverService/data --port [MONGO_PORT]

		Service			|	MONGO_PORT
------------------------|--------------
Document Service		|	27018
User Service			|	27017
Review Service			|	27019

to kill processes of mongodb (in case of ERR:addr is already in use)

> killall -15 mongod


## Spring API

run it on Spring Tool Suite

download and install: https://spring.io

		Service			|		host		|	Port
------------------------|-------------------|----------
Document Service		|	  localhost		| 	8081
User Service			|	  localhost		| 	8082
Review Service			|	  localhost		| 	8083

# Have fun!