const puppeteer = require("puppeteer");
const { createMobile,config } = require("../../../common/mobile");
const { info, saveFile, logging, timeout, reporter } = require("../../../common/util");

const name = "a1";
const logdir = `./logs/au/a1/${info.deviceid}`;

const r = reporter(name);
const logger = logging(name, logdir);

logger.info("-");
logger.info("-");


(async () => {

    const browser = await puppeteer.launch(config);
    const [page] = await browser.pages();

    const m =await createMobile(page);

    //sub status linstener
    m._page.on('response', (response) => {
        let url = response.url();
        let status = response.status();

        logger.info(`${response.request().method()}`,status,url)

        if (url.startsWith("http://at.ifunnyhub.com")) {
            r.s("success")
        }

        if (url.startsWith("http://google.com")){
            r.w("failure", url);
            m.close();
        }

    })

    try {

        r.i("start")

        await m.get(`http://nat.allcpx.com/sub/start?affName=DCG&type=at_ifunny_155&clickId=${info.deviceid}`, { timeout });

        //等待页面加载完成
        await m._page.waitForSelector("button[name='confirm']", { timeout });
        await m._page.waitForSelector("#vasb-fagg-input", { timeout });
        
        await m.sleep(1*1000)


        //保存页面
        saveFile(`${logdir}/1.html`, await m._page.content());

        //勾选
        await m.evaluate(() => { document.querySelector("#vasb-fagg-input").setAttribute('value', true) })

        await r.i("sub_click")

        //点击订阅按钮
        await m.tapElement("button[name='confirm']")

        await m.sleep(10 * 1000)

        saveFile(`${logdir}/2.html`, await m._page.content());

        await r.i("end")

    } catch (e) {

        saveFile(`${logdir}/error.html`, await m._page.content());
        r.e(e + "")

    } finally {
        m.close();
    }

    await browser.close();
})();
