const puppeteer = require("puppeteer");
const devices = require("puppeteer/DeviceDescriptors");

(async () => {
  const browser = await puppeteer.launch({
    headless: false
  });
  const context = await browser.createIncognitoBrowserContext();
  const page = await context.newPage();
  await page.emulate(devices["Nexus 5"]);
  await page.goto("https://www.baidu.com/");
  console.log(await page.title());
  await browser.close();
})();
