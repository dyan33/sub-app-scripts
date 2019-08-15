const pupeeteer = require("puppeteer");
const moment = require("moment");
const deviceDescription = require("puppeteer/DeviceDescriptors");
const {logging, info, saveFile, reporter} = require("../../../common/util");
const today = moment().format("YYYY-MM-DD");
const logdir = `./logs/${today}/au/pty/${info.deviceid}`;
const logger = logging(name, logdir);

const r = reporter(name);

(async () => {
    const browse = pupeeteer.launch({headless: false});
    const page = browse.newPage();
    await page.emulate(deviceDescription["Nexus 5"]);
    await page.on("response", (r) => {
        let url = r.url();
        let status = r.status();
        if (url.startsWith("http")) {
            logger.info(`${r.request().method()}`, status, url)
        }
    });

    try {

    }catch (e) {
        saveFile(`${logdir}/error.html`, await page.content());
    }finally {

    }
})();
