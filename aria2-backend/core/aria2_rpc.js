const jayson = require('jayson');
const ARIA2C_PORT = process.env.ARIA2C_PORT || 6800;
const os = require('os');
const systemStats = require('./system_stats');
const fs = require('fs');
const path = require("path");
const BASE_PATH = path.join(__dirname, "..");
const EXTERNAL_DOWNLOAD_FOLDER = process.env.EXTERNAL_DOWNLOAD_FOLDER;
const DOWNLOADS_FOLDER = path.join(BASE_PATH, "public", "downloads");
const ARIA2C_PATH = path.join(BASE_PATH, "aria2c");
const ARIA2C_CONFIG_PATH = path.join(BASE_PATH, "aria2.conf");

function reCreateDirectory(directoryName) {
  if(fs.existsSync(directoryName)) {
    fs.rmdirSync(directoryName);
  }

  if(!fs.existsSync(directoryName)) {
    fs.mkdirSync(directoryName);
  }
}

let aria2cRPCSupportedMethods = [];
let gids = [];
let gidToFilePath = {};
let gidToUri = {};
let isAria2cRPCMethodsListedOnStartup = false;
let globalConfig = [ "download-result", "keep-unfinished-download-result", "log", "log-level", "enable-http-keep-alive",
                     "max-concurrent-downloads", "max-connection-per-server", "max-download-result", "reuse-uri", "timeout",
                     "enable-http-pipelining", "optimize-concurrent-downloads", "save-cookies", "save-session", "split",
                     "check-integrity", "continue", "connect-timeout", "max-tries", "remote-time", "use-head" ];

if(EXTERNAL_DOWNLOAD_FOLDER !== undefined && EXTERNAL_DOWNLOAD_FOLDER.trim().length !== 0 && path.isAbsolute(EXTERNAL_DOWNLOAD_FOLDER)) {
  // External downloads directory is set using
  reCreateDirectory(EXTERNAL_DOWNLOAD_FOLDER);

  // Remove downloads folder and create a symlink pointing to external downloads directory
  fs.rmSync(DOWNLOADS_FOLDER, { recursive: true, force: true });
  fs.symlink(EXTERNAL_DOWNLOAD_FOLDER, DOWNLOADS_FOLDER, function (err) {
    console.log(err || `Created downloads folder symlink pointing to ${EXTERNAL_DOWNLOAD_FOLDER}`);
  });
  console.log(`Using external downloads folder, ${EXTERNAL_DOWNLOAD_FOLDER}`);
} else {
  // Using default download directory
  reCreateDirectory(DOWNLOADS_FOLDER);
  console.log(`Using default downloads folder, ${DOWNLOADS_FOLDER}`);
}

/*if(fs.existsSync(DOWNLOADS_FOLDER)) {
  fs.rmdirSync(DOWNLOADS_FOLDER);
}

if(!fs.existsSync(DOWNLOADS_FOLDER)) {
  fs.mkdirSync(DOWNLOADS_FOLDER);
}*/

let spawn = require('child_process').spawn;
let spawnAria2Process = spawn(ARIA2C_PATH, [`--conf-path=${ARIA2C_CONFIG_PATH}`], {
    detached: true
});
spawnAria2Process.unref();
console.log(`Process ${spawnAria2Process.spawnfile} started in background with pid ${spawnAria2Process.pid} listening on port, ${ARIA2C_PORT}`);

const client = jayson.client.http(`http://127.0.0.1:${ARIA2C_PORT}/jsonrpc`);

function sendToClient(aria2cRPCMethod, rpcOutput, rpcStatusCode, err, httpResponse = null) {
    if(aria2cRPCMethod == "aria2.getGlobalOption") { // Filtering required global options to be shown to client for changing it
        rpcOutput = Object.entries(rpcOutput).reduce((filteredObject, [k, v]) => {
            if(globalConfig.indexOf(k) !== -1) {
                filteredObject[k] = v;
            }
            return filteredObject;
        }, {});
    }

    let output = {
        aria2cRPCMethod: aria2cRPCMethod,
        result: rpcOutput,
        statusCode: rpcStatusCode,
        error: err
    };

    // console.log(`${os.EOL}${JSON.stringify(output)}${os.EOL}`);

    if(httpResponse != null && httpResponse != undefined) {
        httpResponse.status(rpcStatusCode).json(output);
    } else {
        if(!isAria2cRPCMethodsListedOnStartup) {
            console.log(output);
        }
    }
}

function sendResponse(aria2cRPCMethod, rpcOutput, rpcStatusCode, err, httpResponse) {
    if(httpResponse !== null) {
        sendToClient(aria2cRPCMethod, rpcOutput, rpcStatusCode, err, httpResponse);    
    } else {
        sendToClient(aria2cRPCMethod, rpcOutput, rpcStatusCode, err);
    }
}

function populateGidToFilePath(rpcOutput) {

    if(rpcOutput != undefined && rpcOutput.length != undefined && rpcOutput.length != 0) {
        rpcOutput.forEach(result => {
            let downloadStats = result[0];

            if(downloadStats !== undefined && downloadStats?.length !== 0) {
                if(downloadStats !== undefined) {
                    let files = downloadStats.files;
                    let gid = downloadStats.gid;
                    if(!(gid in gidToFilePath)) {
                        if(files !== undefined && files.length !== 0) {
                            let fileInfo = files[0];
                            let filePath = fileInfo.path;
                            if(filePath !== undefined && filePath.trim().length !== 0) {
                                gidToFilePath[gid] = filePath;
                                gidToFilePath[gid+".aria2"] = filePath+".aria2";
                            }
                        }
                    }
                }
            }
        });
    }

    /*let downloadStats = rpcOutput[0]?.downloadStats;

    console.log(`rpcOutput: ${JSON.stringify(rpcOutput)}`);
    console.log(`downloadStats.length: ${downloadStats?.length}`);*/

}

function deleteFile(fileToBeRemoved) {
    fs.unlink(fileToBeRemoved, function(err) {
        if(err && err.code === 'ENOENT') {
            console.debug(`File, ${fileToBeRemoved} doesn't exist. Skipping file remove.`);
        } else if (err) {
            console.error(`Error occurred while trying to remove file, ${fileToBeRemoved}. Error: ${err}.`);
        } else {
            console.debug(`Successfully removed the file, ${fileToBeRemoved}.`);
        }
    });
}

function makeAria2cRPCRequest(aria2cRPCMethod, aria2cRPCParams, httpResponse = null, multiCallType = null, feedCallback = undefined) {
    client.request(aria2cRPCMethod, aria2cRPCParams, function name(err, response) {
        let rpcStatusCode, rpcOutput={};
        if(err) {
            rpcStatusCode = err.code;
            console.error("Error in Aria2cRPC request", err);
        } else {
            rpcStatusCode = 200;
            rpcOutput = response.result;
        }
        if(aria2cRPCMethod == 'system.listMethods') {
            aria2cRPCSupportedMethods = response.result;
            if(!isAria2cRPCMethodsListedOnStartup) {
                console.log(`${os.EOL}Loaded ${response.result.length} RPC methods for Aria2c as listed below...${os.EOL}${aria2cRPCSupportedMethods.join(os.EOL)}${os.EOL}`);
                isAria2cRPCMethodsListedOnStartup = true;
            }
        } else if(aria2cRPCMethod == 'system.multicall') {
            if(response.result !== undefined) {
                if(multiCallType == 'addUri') {
                    let i=0;
                    let uris = aria2cRPCParams[0];
                    response.result.forEach(result => {
                        if(typeof result[0] === 'string') {
                            let uri = uris[i++].params[0];
                            gids.push(result[0]);
                            if(!(result[0] in gids)) {
                                gidToUri[result[0]] = uri;
                            }
                        }
                    });
                }

                if(feedCallback == undefined) {
                    sendResponse(aria2cRPCMethod, rpcOutput, rpcStatusCode, err, httpResponse);
                } else {
                    populateGidToFilePath(rpcOutput);
                    feedCallback(systemStats, rpcOutput, httpResponse);
                }
            }
        } else {
            if(aria2cRPCMethod == 'aria2.addUri') {
                if(rpcOutput && typeof rpcOutput === 'string') { // Add gid to our array
                    gids.push(rpcOutput);
                }
            } else if(aria2cRPCMethod == 'aria2.remove' || aria2cRPCMethod == 'aria2.forceRemove' || aria2cRPCMethod == 'aria2.removeDownloadResult') {
                if(rpcOutput && typeof rpcOutput === 'string') { // Remove the gid from our array
                    /*console.log("\nBefore");
                    console.log(`aria2cRPCMethod: ${aria2cRPCMethod}`);
                    console.log(`rpcOutput type: ${typeof rpcOutput}`);
                    console.log(`rpcOutput: ${rpcOutput}`);
                    console.log(`aria2cRPCParams: ${JSON.stringify(aria2cRPCParams)}`);
                    console.log(`gids: ${gids}`);*/

                    let gidToRemove = aria2cRPCParams[0];
                    gids = gids.filter(gid => gid !== gidToRemove);

                    //console.log(`gidToRemove: ${gidToRemove}`);
                    //console.log(`gidToFilePath: ${JSON.stringify(gidToFilePath)}`)
                    //console.log(`gidToRemove in gidToFilePath ?: ${gidToRemove in gidToFilePath}`)

                    if(gidToRemove in gidToFilePath) {
                        deleteFile(gidToFilePath[gidToRemove]);
                        deleteFile(gidToFilePath[gidToRemove+".aria2"]);
                        delete gidToFilePath[gidToRemove];
                        delete gidToFilePath[gidToRemove+".aria2"];
                    }

                    /*console.log("\nAfter");
                    console.log(`aria2cRPCMethod: ${aria2cRPCMethod}`);
                    console.log(`rpcOutput type: ${typeof rpcOutput}`);
                    console.log(`rpcOutput: ${rpcOutput}`);
                    console.log(`aria2cRPCParams: ${JSON.stringify(aria2cRPCParams)}`);
                    console.log(`gids: ${gids}`);*/
                }
            }
            sendResponse(aria2cRPCMethod, rpcOutput, rpcStatusCode, err, httpResponse);
        }
    });
}

function getGids() {
    return gids;
}

function getGidToFilePathMap() {
    return gidToFilePath;
}

function getGidToUriMap() {
    return gidToUri;
}

setTimeout(() => makeAria2cRPCRequest('system.listMethods', []), 1000);

module.exports = {
    makeRequest: makeAria2cRPCRequest,
    //gids: gids,
    getGids: getGids,
    getGidToFilePathMap: getGidToFilePathMap,
    getGidToUriMap: getGidToUriMap,
}
