const puppeteer=require("puppeteer");
const { createMobile,config } = require("../../common/mobile");
const { info, saveFile,logging,timeout,reporter } = require("../../common/util");


const name = "thm";
const logdir = `./logs/th/thm/${info.deviceid}/${name}`;

const r = reporter(name);
const logger=logging(name,logdir);

async function run(page) {

  const m=await createMobile(page);

  //sub status linstener
  m._page.on('response', (response)=>{

    let url = response.url();
    let status = response.status();

    logger.info(`${response.request().method()}`,status,url);
    
  })

  try {

    r.i("start")

    await m.get(`http://fa.allcpx.com/30007?aid=${info.deviceid}&cid={clickid}`, { timeout });

    await m.sleep(2 * 1000);

    util.saveFile(`${logdir}/1.html`,await m._page.content());

    r.i("click_1")
    //第一次点击
    await m.tapElement("#good"); 

    await m.sleep(5 * 1000);

    util.saveFile(`${logdir}/2.html`,await m._page.content());
    
    r.i("end")

  } catch (e) {

    if(!m._closed){
      saveFile(`${logdir}/error.html`, await m._page.content());
    }

    r.e(e+"")

  } finally {
    m.close();
  }
}

(async ()=>{

    const browser = await puppeteer.launch(config);
    const [page] = await browser.pages();

    await run(page);

    await browser.close();

})();
