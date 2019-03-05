import express from 'express';
import logger from '../../logger';
import suggestionEngine from '../../suggestionEngine';
const router = express.Router();

//using jsonschema library to validate the input received on requests
var reqValidator = require('jsonschema').validate;
const reqSchema = {
    'type': 'object',
    'properties': {
        'q': { 'type': 'string'}
    },
    'required': ['q']
}

//get method handle for returning event  with optional query eventName
router.get('', function (req, res) {

    //id for logging;
    var reqId = req.headers.ip + '-' + new Date().toISOString();
    logger.info('req: ' +reqId);

    try {
        //invalid request in this case the q parameter was not set
        if (reqValidator(req.query, reqSchema).errors.length > 0) {
            const error = {
                status: 400,
                message: 'Malformed request \'q\' parameter is required'
            }

            res.status(400).send(error);
            logger.error('req:' + reqId + ' error');
            logger.error(error);

        //valid request processing
        } else{
            var matches = suggestionEngine.search(req.query);
            res.status(200).send({"suggestions":matches});
            logger.info('req: ' +reqId + 'completed successfully');
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