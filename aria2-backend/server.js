
const coreLogger = require('./core/logger');

const express = require('express');
const kill = require('kill-port');
const nodeCleanup = require('node-cleanup');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

const authMiddleware = require('./hash/auth_middleware');
//const cyrb53 = require('./hash/cyrb53');
const aria2cRouter = require('./route/aria2c_router');
const PUBLIC_FOLDER_PATH = path.join(__dirname, 'public');

app.set("port", process.env.port || 3000);

app.use(coreLogger.morganMiddleware);

app.use("/downloads", express.static( path.join(PUBLIC_FOLDER_PATH, 'downloads')));

app.use(bodyParser.json());

app.use("/api", aria2cRouter);

app.use("/", express.static(PUBLIC_FOLDER_PATH));

// For serving 404 files...
app.use((req, res, next) => {
    res.status(404).sendFile('404.html', {
        root: PUBLIC_FOLDER_PATH,
        dotfiles: 'deny',
    }, (err) => {
        if (err) {
            console.error(`Error: ${err}`);
        }
    });
});

/* app.use(function(req, res, next) {
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
}); */

// app.use(authMiddleware);


app.listen(app.get('port'), server => {
    console.info(`Expressjs server listen on port ${app.get('port')}`);
    //publishDownloadFeeds();
});

function publishDownloadFeeds() {
    setTimeout(() => {
        //require('./core/system_stats').info();
        console.log(JSON.stringify(require('./core/system_stats').info()));
    }, 3000);
}

nodeCleanup(function (exitCode, signal) {
    if (signal) {
        kill(6800, 'tcp')
            .then(console.log)
            .catch(console.log)
            .finally(() => process.kill(process.pid, signal));
        nodeCleanup.uninstall(); // don't call cleanup handler again
        return false;
    }
});



