<p align="center">
  <img src="https://miro.medium.com/max/800/1*cQAZ2YrXqmmrsKMFM4-oMw.jpeg" width="670" title="NodeExerciset">
</p>

# LMS(Library Management System) 

This repository contains a full configuration that runs NodeJS RESTful API Microservice

# Requirements
* NodeJS
* MongoDB

# For installing the required packages
You have to use the following command to install the necessary packages:
 ```
 npm install
 ```
 
# Build for staging and production environments
Use following command to build project:
```
npm run build
```
Use following command to start project on staging and production environments:
```
npm start
```
See package.json for more details.

# Tests
Following tests libraries are used for unit/integration tests:
* Mocha
* Sinon
* Chai

Use following command to run tests:
```
npm run test
```

# Overview
This repository consists of 2 folders namely:
* Book 
* User

Which are the services accessing different databases.

## Book
Book service consists of:
* controller - Has methods for CRUD operations on books ,to search book and also a
method to send response to the request from user service(i.e sending favorite book data).
* middleware - Which handles the authorization part by using JSON Web Token(JWT).
* models - Models required
* routes - Routes required
* tests - Test cases
* app.js - main script

Some of the methods are authorized for only admins (for example: createBook ,updateBook ,deleteBook).
This is achieved at route level.
All the errors are handled by a separate middle in app.js file

## User 
User service consists of:
* controller - Has methods for CRUD operations on users and methods related to mark and unmark a 
book as favorite ,these methods are responsible for sending a request and handling the response
by the book service.
* middleware - Which handles the authorization part by using JSON Web Token(JWT).
* models - Models required
* routes - Routes required
* tests - Test cases
* app.js - main script

Some of the methods are authorized for only admins (for example: updateUser ,deleteUser).
This is achieved at route level.
All the errors are handled by a separate middle in app.js file
