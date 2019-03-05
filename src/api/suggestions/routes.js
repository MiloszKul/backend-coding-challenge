import express from 'express';
import logger from '../../logger';
import suggestionEngine from '../../suggestionEngine';
const router = express.Router();

//using jsonschema library to validate the input received on put requests
var reqValidator = require('jsonschema').validate;

const reqSchema = {
    'type': 'object',
    'properties': {
        'q': { 'type': 'string'},
        'latitude':{'type':'string'},
        'longitude':{'type':'string'}
    },
    'dependencies': {
        'longitude': ['latitude'],
        'latitude': ['longitude']
    },
    'required': ['q']
}

//get method handle for returning event  with optional query eventName
router.get('', function (req, res) {
    
    //id for logging;
    var reqId = req.ip + '-' + new Date().toISOString();

    //log req
    logger.info('new request req: ' +reqId);
    try {
        //validate the request body 
        if (reqValidator(req.query, reqSchema).errors.length > 0) {
            const error = {
                status: 400,
                message: 'Malformed request',
                errors: reqValidator(req.query, reqSchema).errors.map((err)=>{return err.message})
            }
            res.status(400).send(error);
            logger.error('req:' + reqId + ' error in request params');
            logger.error(error);
        } else{
            var matches = suggestionEngine.search(req.query);

            res.status(200).send({"suggestions":matches});
            logger.info('req:' + reqId + ' completed');
        }
    } catch (e) {
        res.status(500).send('Server Error');
        logger.error('req:' + reqId + ' Unhandled Error ');
        logger.error(new Error(e));
    }

});

//respond 405 to block all other method calls
router.all('', function (req, res) {
    res.status(405).send('');
});


export default router;