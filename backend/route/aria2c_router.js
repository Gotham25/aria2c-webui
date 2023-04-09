
const express = require('express');
const router = express.Router();

//const systemStats = require('../core/system_stats');
const aria2RPC = require('../core/aria2_rpc');

router.post('/fetchFeed', async (req, res, next) => {
    function feedCallback(systemStats, rpcOutput, res) {

        rpcOutput.forEach((part, index, theArray) => {
            let _stats = part[0];
            let gidToUriMap = aria2RPC.getGidToUriMap();
            _stats.downloadUrl = (gidToUriMap[_stats.gid] || [])[0] || "";
            theArray[index] = part;
        });

        res.status(200).json({
            systemStats: systemStats.info(),
            downloadStats: rpcOutput,
            statusCode: 200,
            status: 'success',
            timestamp: new Date().toISOString()
        });
    }

    tellAllStatus(req, res, next, feedCallback);
});

router.get('/version', async (req, res, next) => {
    aria2RPC.makeRequest('aria2.getVersion', [], res);
});

router.get('/sessionInfo', async (req, res, next) => {
    aria2RPC.makeRequest('aria2.getSessionInfo', [], res);
});

router.get('/getGlobalOptions', async (req, res, next) => {
    aria2RPC.makeRequest('aria2.getGlobalOption', [], res);
});

router.post('/changeGlobalOptions', async (req, res, next) => {
    let aria2cRPCParams = req.body;
    aria2RPC.makeRequest('aria2.changeGlobalOption', [ aria2cRPCParams ], res);
});

router.post('/addUri', async (req, res, next) => {
    let addUriRequest = req.body;
    let uriSources = addUriRequest.uris;
    let uriParams = addUriRequest.params;
    aria2RPC.makeRequest('aria2.addUri', [ uriSources, uriParams ], res);
});

router.post('/addUris', async (req, res, next) => {
    let addUriRequest = req.body;
    let uris = addUriRequest.uris;
    let uriParams = addUriRequest.params;
    let params = [];
    uris.forEach(uri => {
        params.push({
            'methodName': 'aria2.addUri',
            'params': [ [ uri ], uriParams ]
        });
    });

    aria2RPC.makeRequest('system.multicall', [ params ], res, 'addUri');
});

router.post('/tellStatus/:gid', async (req, res, next) => {
    let gid = req.params['gid'];

    aria2RPC.makeRequest('aria2.tellStatus', [ gid ], res);
});

router.post('/pauseDownload/:gid', async (req, res, next) => {
    let gid = req.params['gid'];

    aria2RPC.makeRequest('aria2.pause', [ gid ], res);
});

router.post('/unPauseDownload/:gid', async (req, res, next) => {
    let gid = req.params['gid'];

    aria2RPC.makeRequest('aria2.unpause', [ gid ], res);
});

router.post('/pauseAllDownloads', async (req, res, next) => {
    aria2RPC.makeRequest('aria2.pauseAll', [], res);
});

router.post('/forcePauseDownload/:gid', async (req, res, next) => {
    let gid = req.params['gid'];

    aria2RPC.makeRequest('aria2.forcePause', [ gid ], res);
});

router.post('/unPauseAllDownloads', async (req, res, next) => {
    aria2RPC.makeRequest('aria2.unpauseAll', [], res);
});

router.post('/removeDownload/:gid', async (req, res, next) => {
    let gid = req.params['gid'];

    aria2RPC.makeRequest('aria2.remove', [ gid ], res);
});

router.post('/forceRemoveDownload/:gid', async(req, res, next) => {
    let gid = req.params['gid'];

    aria2RPC.makeRequest('aria2.forceRemove', [ gid ], res);
});

router.post('/removeDownloadResult/:gid', async(req, res, next) => {
    let gid = req.params['gid'];

    aria2RPC.makeRequest('aria2.removeDownloadResult', [ gid ], res);
});

router.post('/tellAllStatus', async (req, res, next) => {
    tellAllStatus(req, res, next);
});

function tellAllStatus(req, res, next, feedCallback = undefined) {
    let gids = aria2RPC.getGids();
    // let gidToFilePathMap = aria2RPC.getGidToFilePathMap();
    // console.log(`tellAllStatus:> gids: [${gids}]`);
    // console.log(`gidToFilePathMap:> gidToFilePathMap: ${JSON.stringify(gidToFilePathMap)}`);
    // let getGidToUriMap = aria2RPC.getGidToUriMap();
    // console.log(`getGidToUriMap:  ${JSON.stringify(getGidToUriMap)}`);
    let params = [];
    gids.forEach(gid => {
        params.push({
            'methodName': 'aria2.tellStatus',
            'params': [ gid ]
        });
    });

    aria2RPC.makeRequest('system.multicall', [ params ], res, 'tellStatus', feedCallback);
}

router.get('/globalStats', async (req, res, next) => {
    aria2RPC.makeRequest('aria2.getGlobalStat', [], res);
});

router.get('/status', async(req, res, next) => {
    res.status(200).json({
        message: 'aria2c backend is up and running',
        statusCode: 200,
        status: 'success',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;
