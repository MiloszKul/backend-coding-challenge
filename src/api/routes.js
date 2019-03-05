import express from 'express';
const router = express.Router();

//routes loader for all api paths under the application
//in the case of this service this will only be the suggestions paths but this could easily be expanded according to same logic for all necessary paths
import suggestions from './suggestions';

const api = () => {    
    router.use('/suggestions', suggestions.routes);
    return router;
};

export default api;