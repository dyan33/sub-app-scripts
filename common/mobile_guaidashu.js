const devices = require("puppeteer/DeviceDescriptors");
const process = require("process");
const axios = require("axios");
const {random, info} = require("./util");

const timeout = 60 * 1000;

const proxy = {
    host: "127.0.0.1",
    port: info.proxy.split(":")[1]
};

const config = {
    headless: false,
    devtools: true,
    ignoreHTTPSErrors: true,
    env: {
        TZ: info.timezone,
        ...process.env
    },
    //  incognito => Causes the browser to launch directly in incognito mode.
    //  proxy-server => Uses a specified proxy server, overrides system settings. This switch only affects HTTP and HTTPS requests.
    //  lang => 	The language file that we want to try to open. Of the form language[-country] where language is the 2 letter code from ISO-639
    args: ["--incognito", `--proxy-server=${info.proxy}`, `--lang=${info.lang}`]
};

class Mobile {
    constructor(page, client) {
        this._page = page;
        this._client = client;
        this._page.setDefaultTimeout(timeout);
    }


}
