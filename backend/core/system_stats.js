const os = require('os');

function getSystemStats() {
    
    /* let systemUptime = os.uptime();
    let totalMemory = formatBytes(os.totalmem());
    let freeMemory = formatBytes(os.freemem());
    let uptime = secondsToDhms(systemUptime);
    let uptimeInWords = secondsToDhmsInWords(systemUptime);
    let hostname = os.hostname;
    let platform = os.platform();
    let version = os.version();
    let arch = os.arch();
    let release = os.release();

    console.log(JSON.stringify(os.networkInterfaces()));

    return {
        'freeMemory': freeMemory,
        'totalMemory': totalMemory,
        'uptime': uptime,
        'uptimeInWords': uptimeInWords,
        'hostname': hostname,
        'platform': platform,
        'version': version,
        'arch': arch,
        'release': release
    }; */

    let networkInterfaces = os.networkInterfaces();
    let networks = [];

    for (const networkName in networkInterfaces) {
        networkInterfaces[networkName].forEach(network => {
            let formattedNetwork = JSON.parse(JSON.stringify(network));
            formattedNetwork.name = networkName;
            networks.push(formattedNetwork);
        });
    }

    return {
        osInfo: {
            name: os.hostname(),
            type: os.type(),
            release: os.release(),
            platform: os.platform(),
            architecture: os.arch(),
            version: os.version()
        },
        memoryInfo: {
            totalMemory: formatBytes(os.totalmem()),
            freeMemory: formatBytes(os.freemem()),
            loadAverage: os.loadavg().join(", ")
        },
        miscellaneousInfo: {
            uptime: secondsToDhmsInWords(os.uptime()),
            homeDir: os.homedir(),
            tmpDir: os.tmpdir()
        },
        userInfo: os.userInfo(),
        networkInfo: networks
    };
}


function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function secondsToDhmsInWords(seconds) {
    seconds = Number(seconds);
    var d = Math.floor(seconds / (3600 * 24));
    var h = Math.floor(seconds % (3600 * 24) / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 60);

    var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return dDisplay + hDisplay + mDisplay + sDisplay;
}

function secondsToDhms(seconds) {
    seconds = Number(seconds);
    var d = padleadingZeros(Math.floor(seconds / (3600 * 24)));
    var h = padleadingZeros(Math.floor(seconds % (3600 * 24) / 3600));
    var m = padleadingZeros(Math.floor(seconds % 3600 / 60));
    var s = padleadingZeros(Math.floor(seconds % 60));

    return `${d}:${h}:${m}:${s}`;
}

function padleadingZeros(number) {
    return number.toString().padStart(2, "0");
}

module.exports.info = getSystemStats;
