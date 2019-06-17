const puppeteer = require("puppeteer");

const { config, createMobile } = require("../../../common/mobile")

const j147 = require("./j147");



(async () => {
    
    console.log("start")

    const browser = await puppeteer.launch(config);

    const [page1] = await browser.pages();
    const page2 = await browser.newPage();
    
    await j147.run(page1);

    await browser.close();

    console.log("end")
})();