# Kuro

A simple task manage app for self-training using MEAN (MongoDB - Express - AngularJS - NodeJS).

This project is temporarily pending for now since I don't have time to dev it.

---

##1. Requirement
1. [NodeJS](http://nodejs.org/) v0.10 since nowaday mongoose is not compatible with v0.12
2. [MongoDB](http://www.mongodb.org/)

##2. Installation
When you got your NodeJs and MongoDB ready (dir in path if windows), it is about time to clone the project.
Install node_modules by using following commandes:
```
npm update
// OR
npm install
```
Try to launch the mongodb engine by:
```
// In your project dir
mongod --dbpath ./db/_assets/
```
```
// In another console, run
node server.js
```
There's a sub-option by running the server.js which is nodemon server.js. [Nodemon](http://nodemon.io/) is a plugin nodejs who restart server when there's changes in the project dir. To install
```
npm install -g nodemon
```
##3. Visualization
When you see the log in console "listning to port 3000". Open up your chrome/firefox (fuck ie), enter:
```
localhost:3000
```
That's it.
Be aware of the fact that there's no data in project, so you have to load the test data fixtures in /db/, but this feature is not complete yet.

Updated at 2015.04.03
