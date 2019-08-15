const fs = require("fs");
const path = require("path");
const log4js = require("log4js")
const axios = require("axios")

const timeout = 60 * 1000

const args = process.argv.splice(2);

const info = {
    lang: args[0],
    timezone: args[1],
    proxy: args[2],
    deviceid: args[3],
    meta: args[4],
}

const logConfig = {
    appenders: {
        out: {type: 'stdout'}
    },
    categories: {
        default: {
            appenders: ["out"],
            level: "debug",
        }
    },
}

function random(min, max) {
    let num = Math.random() * (max - min) + min;
    if (num == min || num == max) {
        num = random(min, max);
    }
    return num;
}

function mkdirs(dirpath, callback) {
    fs.exists(dirpath, function (exists) {
        if (exists) {
            callback();
        } else {
            mkdirs(path.dirname(dirpath), function () {
                fs.mkdir(dirpath, callback);
            });
        }
    });
}

function saveFile(filePath, content) {
    let dirname = path.dirname(filePath);

    mkdirs(dirname, () => {
        fs.writeFile(filePath, content, function (err) {
            if (err) {
                console.log(err);
            }
        });
    });
}


function logging(name, dirname) {

    logConfig.appenders[name] = {
        type: "file",
        filename: `${dirname}/run.log`
    }

    logConfig.categories[name] = {
        appenders: [name],
        level: "info",
    }

    log4js.configure(logConfig);

    return log4js.getLogger(name);
}


class Report {
    constructor(name) {
        this.name = name;
    }

    r(level, tag, message) {
        const url = `http://52.53.238.169:8081/app/log?name=${this.name}`;

        const data = JSON.parse(info.meta.replace(/\n/g, ""))
        data.level = level;
        data.tag = tag;
        data.info = message;
        data.date = new Date().toISOString();

        axios
            .post(url, data)
            .then(response => {
            })
            .catch(error => {
                if (error) {
                    console.log(error);
                }
            });
    }

    i(tag, message) {
        this.r("INFO", tag, message)
    }

    w(tag, message) {
        this.r("WARNING", tag, message)
    }

    s(tag, message) {
        this.r("SUCCESS", tag, message)
    }

    e(tag, message) {
        this.r("ERROR", tag, message)
    }

}

function reporter(name) {
    return new Report(name);
}


module.exports = {
    random,
    saveFile,
    info,
    logging,
    reporter,
    timeout
};
