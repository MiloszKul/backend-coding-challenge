## Coveo Assignment REST Service

application available at: 
https://mk-coveo.herokuapp.comapi/suggestions?q=toronto

### About the REST API

The API is a simple implementation using express.js. While the current setup splitting the routes/server into multiple files is not necessary given the simplicity of the service for code maintainbilty and future extensions it is good practice.

The suggestionEngine is setup as a seperate module exposing an interface to the actual API that uses it. This facilites future changes as if any changes where done to how the suggestions are obtained one would only not have to change anything inside the API itself.

**Additional Notes:** 

A logger was implemented for advanced logging as well as schema validation for put/post requests (see libraries below).

Schema validation for the request (ensuring the *q* parameter is present) was implemented via json schema 

Since the idea was to approximate a production environment a travis configuration and extension was also doen to perform tests before building and deployments,

### Installation/ Running The Application

Node.js must be installed see Frameworks sections below

First cd into the directory of this application.

To install the application run: `npm install`

To run the development version run: `npm run dev`

This command runs the app using the nodemon library to reload each time source code is changed for development ease.

To create a build (this is done during travis testing) run `npm run build`

To run the application run `npm start`

For testing run `npm test` (see below for details)

### Implementation Structure

```
+-- dist //the final code that is ran on heroku (ignored from git)
+-- logs //logs folder is created after running the application 
|   +-- combined_{{timestamp}}.log
|   +-- error_{{timestamp}}.log
+-- src //source code
|   +-- api
|       +--suggestions
|   +-- index.js
|   +-- suggestionEngine.js
|   +-- logger.js
+-- test //the tests using mocha
|   +-- server-test.js
+-- .babelsrc
+-- .env //variables ignored
+-- .travis.yml travis config
+-- .package.json

```
### Frameworks / libraires

The application is build using Node.js to install node js please visit:
[Node](https://nodejs.org/en/)

All other used libraries are publicly available on the npm registry here is a full list with short description:

#### For the REST API:

[Express JS](https://expressjs.com/) : standard web framework

[Winston](https://www.npmjs.com/package/winston) : Advanced logging capability

[jsonschema](https://www.npmjs.com/package/jsonschema) : json validation library

[fuse.js](https://fusejs.io) : auto complete library for analyzing suggestions

[Babel](https://babeljs.io) : transpiling/compilation of javascript

[dotenv](https://www.npmjs.com/package/dotenv) : env file handling

[body-parser](https://www.npmjs.com/package/body-parser) : put request handling in node

#### For Testing

[Mocha](https://mochajs.org) : testing framework

[chai](https://www.chaijs.com) : test assertions

[supertest](https://www.npmjs.com/package/supertest) : test framework helper

### Testing Specification 

All tests are included in the server-test.js file. please run `npm run build` before running test

travis runs all included tests before deployment

This is a script using the frameworks described above to automatically test http calls and their return values to point out any differences versus the expected values.

Simple testing of this server can also be performed using [Postman](https://www.getpostman.com). The configured framework here allows to split tests into modules and run them automtically for automation and improved checking of the results.

running `npm test` will run all configured tests according to specification and return any errors at the end 

The test files could be split into several modules for easier test mainteance if this service was to be scaled similar to the api structure.