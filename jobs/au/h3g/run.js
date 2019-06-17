const puppeteer = require("puppeteer");

const { config, newWindow } = require("../../../common/mobile")

const j147 = require("./j147");
const j156 = require("./j156");



(async () => {

    console.log("start")

    const browser = await puppeteer.launch(config);

    const [page1] = await browser.pages();
    const page2 = await newWindow(browser);
    
    await Promise.all([j147.run(page1),j156.run(page2)]);

    await browser.close();

    console.log("end")
})();