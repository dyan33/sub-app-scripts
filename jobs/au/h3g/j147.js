const moment = require("moment");

const { createMobile } = require("../../../common/mobile");
const { info, saveFile, logging, timeout, reporter } = require("../../../common/util");

const name = "j147";
const todday = moment().format("YYYY-MM-DD");
const logdir = `./logs/${todday}/au/h3g/${info.deviceid}/${name}/`;

const r = new reporter(name);
const logger = logging(name, logdir);

async function run(page) {

  const m = await createMobile(page);

  //状态监听
  m._page.on('response', (response) => {

    let url = response.url();
    let status = response.status();

    logger.info(`${response.request().method()}`, status, url);

    //跳转订阅页面失败
    if (status === 302 && url.startsWith("https://www.mobimaniac.mobi/fp/return/error")) {
      r.w("failure", url);
      m.close();
    }

    // http://pgw.wap.net-m.net/pgw/io/cp/reply0uupc/89/1589530504?result=OK
    if (status === 302 && url.endsWith("result=OK")) {
      r.s("success")
    }
  })

  try {

    r.i("start");
    logger.info("start");

    await m.get(`http://lsl.allcpx.com/offer/track/147`);

    //等待页面加载完成
    await m._page.waitForResponse(response => response.url().startsWith("https://bam.nr-data.net"));

    saveFile(`${logdir}/1.html`, await m._page.content());

    r.i("step1")
    logger.info("step1");

    //第一次点击
    await m.tapElement("#form_click_submit");

    //https://www.pages06.net/WTS/event.jpeg
    //等待页面加载完成
    await m._page.waitForResponse(response => response.url().startsWith("https://www.pages06.net/WTS/event.jpeg"));

    //email是否为空
    await m._page.evaluate((aid) => {

      let input = document.getElementById("email");
      let email = input.getAttribute("value");
      if (!email) {
        input.setAttribute("value", `${aid}@gmail.com`)
      }

    }, info.deviceid)

    saveFile(`${logdir}/2.html`, await m._page.content());

    r.i("step2")
    logger.info("step2");

    //第二次点击
    await m.tapElement("input[name='submit']");

    //等待页面加载完成
    await m._page.waitForResponse(response => response.url().startsWith("https://www.mobimaniac.mobi"));

    saveFile(`${logdir}/3.html`, await m._page.content());

  } catch (e) {

    if (!m._closed) {
      saveFile(`${logdir}/error.html`, await m._page.content());
    }

    r.e("error", e + "")

  } finally {
    m.close();
  }
}

module.exports = { run }
