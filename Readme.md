# BIG NOTE

**THERE IS NO DATA IN DATABASE BECAUSE IT WILL EXCEED GITHUB LIMITATION**

before running this project please copy and paste this project to somewhere else

because after do a black-box testing, the data will be stored in ~/your/directory/to/OfficerBossProject/Backend/AllServices/data

and ~/data folder will be exceeded github size limitation

so.. to avoid this problem, I suggest 3 ways, choose one you like 

1. copy and paste this project to somewhere else before developing and testing, or

2. use another database path while running mongodb, or

3. just follow the instruction but before push to github, you have to delete ~/AllServices/data and create an empty folder named data then push

then and you will still be able to test this project by your own current database data

if you push a new update, don't forget to push .classpath and .project too! – I had made a mistake hahahah

Thank you

# Frontend

ionic framework

download and install: http://ionicframework.com

NOTE: requires nodejs

change directory to ~/whatever/OfficerBossProject/Frontend

> cd ~/whatever/OfficerBossProject/Frontend

run ionic server

> $ ionic serve 

# Backend
## MongoDB

download and install: https://www.mongodb.org

there is no data in ~/whatever/AllService/data yet because the size exceeds GitHub limit

change directory to ~/whatever/AllService/data, example

> cd ~/whatever/DocumentService/data

NOTE: ~/data folder will not be able to be uploaded to github because of size limitation, please copy and paste OfficerBossProject to another directory before moving to the next step

run mongo database for each service using command below

> mongod --dbpath ~/whatever/WhateverService/data --port [MONGO_PORT]

		Service			|	MONGO_PORT
------------------------|--------------
Document Service		|	27018
User Service			|	27017
Review Service			|	27019
File Service 			|	27020

to kill processes of mongodb (in case of ERR:addr is already in use)

> killall -15 mongod


## Spring API

I implements it by JAX-RS (not Spring MVC)
because it's less complexity and less memory consume (as fas as my knowledge)

run it on Spring Tool Suite

download and install: https://spring.io

		Service			|		host		|	Port
------------------------|-------------------|----------
Document Service		|	  localhost		| 	8081
User Service			|	  localhost		| 	8082
Review Service			|	  localhost		| 	8083
File Service 			|	  localhost		|	8084

# Have fun!