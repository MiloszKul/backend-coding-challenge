import Fuse from 'fuse.js';
import fs from 'fs';
import tsv from 'tsv';
import logger from './logger';

var fuse;

/**
 * 
 * suggestion engine used by the api. it isinitiated at start of the server to avoid i/o reads on each request
 * the engine uses the fuse.js library to compute scores which uses the bitap alogirthm for string matching
 * 
 */
//fuse library settings

const fuseOptions = {
    threshold: 0.35,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    findAllMatches: true,
    includeScore: true,
    keys: [
        "name",
        "asciiname",
        "alternatenames"
    ]
};

/*
    calculate distance formula:
    https://www.movable-type.co.uk/scripts/latlong.html

*/
const distanceInKM = (lat1,long1,lat2,long2) => {
    const R = 6371 // constant for distnace  6371 km from formula;

    const toRadians = x => (x * Math.PI) / 180; //convert value to radians

    var diffLat = toRadians(lat2 - lat1) / 2;
    var diffLon = toRadians(long2 - long1) / 2;

    var a = Math.sin(diffLat) * Math.sin(diffLat) +
            Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
            Math.sin(diffLon) * Math.sin(diffLon);

    return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

}

const distScore = (distance) => {
    //largest distance would be opposite sides of equator or 12756 * pi / 2 = 20036km
    return 1 - Math.abs(distance)/20036;
    
}
const adjustScore = (result, query) => {
    //note: fuse uses a 0 score for perfect 1 for mismatch hence score is always reverse at the end here 
    var score = 1 - result.score;

    //determine if scores need to be adjusted for location 
    if (query.longitude && query.latitude) {

        var distance = distanceInKM(result.item.lat,result.item.long,query.latitude,query.longitude);
        score *= distScore(distance);

    }
    return score;
}

/*
    conversion of name to match specification format 
    data set has canadian provinces as codes conversion available here, key # 6 does not exist this is not an error: http://download.geonames.org/export/dump/admin1CodesASCII.txt
    us states given as plain text
*/
const caProvincesMap = {
    1:'AB',
    2:'BC',
    3:'MB',
    4:'NB',
    5:'NL',
    7:'NS',
    8:'ON',
    9:'PE',
    10:'QC',
    11:'SK',
    12:'YT',
    13:'NT',
    14:'NU'
};
const convertName = (item) => item.name + ', ' + (item.country ==='CA' ? caProvincesMap[item.admin1]:item.admin1) + ', ' + item.country;

var suggestionEngine = {
    //start function loads the file and initiates fuse
    start: () => {
        var cities = tsv.parse(fs.readFileSync("./data/cities_canada-usa.tsv").toString());
        logger.info('cities data loaded');

        fuse = new Fuse(cities, fuseOptions);
        logger.info('fuse enginer initiated');

    },
    //perform search using fuse and adjust scores based on location if necessary 
    search: (query) => {
        var results = fuse.search(query.q).map((result) => {
            return {
                name: convertName(result.item),
                latitude: result.item.lat,
                longitude: result.item.long,
                score: adjustScore(result, query)
            }
        })

        //return list of results sorted by score 
        return results.sort((rA, rB) => rB.score - rA.score);
    }

}


export default suggestionEngine;