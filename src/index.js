import express from 'express';
import bodyParser from 'body-parser';
import api from './api';
import logger  from './logger';
import suggestionEngine from './suggestionEngine';

//main server definition 

//express app definition
var app = express();

//handling of json in body using body parser
app.use(bodyParser.json());

//start the suggestion engine
suggestionEngine.start();

//api routes load 
app.use('/api', api.router());

//start the rest service
app.listen(process.env.APPLICATION_PORT);

logger.info('App Started On localhost:' + process.env.PORT);

//export the app module will be used for testing here
module.exports = app;  