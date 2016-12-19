# FullStackTest

A single page app with a REST Api architecture built on Node and Angular.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine.

### Prerequisites

You'll need the following:
 
 **Node.js** ( Installation guide: https://docs.npmjs.com/getting-started/installing-node )
 
 **Bower** ( Installation guide: https://bower.io/#install-bower )
 
 **MySQL Server** ( Installation guide: https://dev.mysql.com/doc/refman/5.6/en/installing.html )

### Installation & Configuration

Certain configuration in both the application and the database must be done before this project is usable.

### Step 1: Configuring a local MySQL instance

Make sure you have a **running MySQL server**. Then:

* **Go to the project's root folder** 

 * **Open a console and run** the following command: ( replace {yourDBusername} with your MySQL user )
 
    **mysql -u {yourDBusername} -p < db.sql**  (it will ask for your MySQL user password)
	   
### Step 2: Configure the access to the database from the application 

* Go to the backend folder and **edit the file 'env.json'.**

 * **Change the 'user' and 'password' keys under the development object**
  (use the same values that you've used at the previous step) 
  
  * **Save and close the file.**

### Step 3: Installing project dependencies

* Go to the **frontend folder** and **run "bower install"** 

* Go to the **backend folder** and **run "npm install"**

### Step 4: Build and Run the project
 
* Go to the **backend folder** and run the following comands:

 * **"gulp"**
 
 	* **"npm start"**

 		* **Open your browser and enter the url "http://localhost:8000"**

## Rest API documentation

 * See API_REST_DOCS.html on the project's root folder 

## Doing changes
If you've done some changes in the source, you may want **to rebuild the project** by **running "gulp" from the backend folder.**

## Built With

* [Angular v1.6.0] (https://angularjs.org/) - The web framework used
* [NodeJS] (https://nodejs.org) - for the backend
* [ExpressJS] (http://expressjs.com/) - The web server used to create the REST Api

## Versioning

GIT (https://git-scm.com) was used for versioning

## Authors

* ** Alejandro Martinez **

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
