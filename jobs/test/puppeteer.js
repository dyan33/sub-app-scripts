const puppeteer = require('puppeteer');

let x = (async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://example.com");
    await page.screenshot({path: 'example.png'});

    await browser.close();
});


let y = (async () => {
    const browser = await puppeteer.launch();
    const [page] = await browser.pages();
    await page.goto('https://news.ycombinator.com', {waitUntil: 'networkidle2'});
    await page.pdf({path: "hn.pdf", format: "A4"});
    await browser.close();
});

y().then((resolve, reject) => {
    console.log(resolve)
});
