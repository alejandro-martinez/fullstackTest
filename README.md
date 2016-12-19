# FullStackTest

A single page app that consists in a CRUD system that relays on a REST api built on NodeJS, Express and MySQL.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for deployment purposes.

### Prerequisites

You'll need the following:

1) Node.js: 
	Installation guide: https://docs.npmjs.com/getting-started/installing-node

2) MySQL Server: 
	Installation guide: https://dev.mysql.com/doc/refman/5.6/en/installing.html

### Installation & Configuration

Certain configuration in both the application and the database must be done before this project is usable.

Step 1: Configuring a local MySQL instance 

1) Make sure you have a running MySQL server. Then:

	Go to the project's root folder ( the folder where you've clone the project into).

	Open a console and run the following command: (it will ask for your user password)

	"mysql -u yourDBusername -p < fullstackTest.sql"

Step 2: Configure the access to the database from the application

a)	Go to the backend folder and edit the file env.json.

	You'll have to edit the user and password keys under the development object (use the same values that you've used at the previous step), save and close the file.

Step 3: Installing app dependencies

	a) Go to the frontend folder and run "bower install".

	b) Go to the backend folder and run "npm install".

Step 4: Run the project

	a) On the backend folder, run "npm start"

	b) Open your browser on "http://localhost:8000"

## Doing changes

	If you've done some changes in the source, you may want to rebuild the project by running "gulp" at the backend folder.

## Built With

* [Angular v1.6.0] (https://angularjs.org/) - The web framework used
* [NodeJS] (https://nodejs.org) - for the backend
* [Express.JS] (http://expressjs.com/) - The web server used to create the REST Api

## Versioning

GIT (https://git-scm.com) was used for versioning

## Authors

* ** Alejandro Martinez**

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details