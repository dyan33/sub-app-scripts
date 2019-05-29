const puppeteer = require("puppeteer");

puppeteer
  .launch({
    headless: false
  })
  .then(async browser => {
    const [page] = await browser.pages();

    await page.goto("https://www.baidu.com");


    console.log(await page.content())


    // other actions...
    await page.waitFor(10 * 1000);

    await browser.close();
  });
