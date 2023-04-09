
const cyrb53 = require('./cyrb53');

function authorizeRequest(req, res, next) {
    let requestTime = req.headers['x-request-time'];
    let apiToken = req.headers['x-api-token'];

    if(!req.path.startsWith('/api')) {
        return;
    }

    if(requestTime === undefined || requestTime.trim().length === 0 || apiToken === undefined || apiToken.trim().length === 0) {
        res.status(400).json({
            statusCode: 400,
            errorMessage: 'Missing required headers in the request'
        });
        return;
    }

    let hash = cyrb53.hash(requestTime, requestTime);
    //console.log(`requestTime : ${requestTime}\thash: ${hash}`);
    if(apiToken != hash) {
        // error
        res.status(400).json({
            statusCode: 400,
            errorMessage: 'API token validation failed'
        });
    } else {
        next();
    }
}

module.exports = authorizeRequest;
