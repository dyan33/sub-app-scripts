//奥地利h3g

const mobile = require("./common/mobile");
const util = require("./common/util");
const { Report } = require("./common/report");

const r = new Report("h3g");
const info = util.info();

const timeout = 60 * 1000


function linstener(response) {
  let url = response.url();
  let status = response.status();

  //alreay sub
  if (status === 302 && url.startsWith("https://www.mobimaniac.mobi:443/fp/return/error")) {
    r.w("step2_error", url)
  }

  // http://pgw.wap.net-m.net/pgw/io/cp/reply0uupc/89/1589530504?result=OK
  if (status === 302 && url.endsWith("result=OK")) {
    r.s("success")
  }
}


(async () => {

  const m = await mobile.start({
    headless: false,
    devtools: true,
    ignoreHTTPSErrors: true,
    env: {
      TZ: info.timezone,
      ...process.env
    },
    args: ["--incognito", `--proxy-server=${info.proxy}`, `--lang=${info.lang}`]
  });

  //sub status linstener
  m._page.on('response', linstener)

  try {

    r.i("run_h3g_script")

    await m.get(`http://lsl.allcpx.com/offer/track/147`, { timeout });

    //https://js-agent.newrelic.com:443/nr-1123.min.js
    //等待页面加载完成
    await m._page.waitForResponse(response => {
      let url = response.url();
      let method = response.request().method();
      return url.startsWith("https://bam.nr-data.net")

    });

    util.saveFile(`./pages/h3g/${info.deviceid}/1.html`, await m._page.content());

    r.i("step1")
    //第一次点击
    await m.tapElement("#form_click_submit");


    //https://www.pages06.net/WTS/event.jpeg
    //等待页面加载完成
    await m._page.waitForResponse(response => {
      let url = response.url();
      let method = response.request().method();
      return url.startsWith("https://www.pages06.net/WTS/event.jpeg")

    }, { timeout });

    //email是否为空
    await m._page.evaluate((aid) => {

      let input = document.getElementById("email");
      let email = input.getAttribute("value");
      if (!email) {
        input.setAttribute("value", `${aid}@gmail.com`)
      }

    }, info.deviceid)

    util.saveFile(`./pages/h3g/${info.deviceid}/2.html`, await m._page.content());

    r.i("step2")
    //第二次点击
    await m.tapElement("input[name='submit']");

    //等待页面加载完成
    await m._page.waitForResponse(response => {
      let url = response.url();
      return url.startsWith("https://www.mobimaniac.mobi")
    }, { timeout });

    util.saveFile(`./pages/h3g/${info.deviceid}/3.html`, await m._page.content());
    
  } catch (e) {
    console.log(e);
    util.saveFile(`./pages/h3g/${info.deviceid}/error.html`, await m._page.content());
    r.e(e)
  } finally {
    m.close();
  }
})();
