//奥地利h3g

const { info, saveFile } = require("../../../common/util");
const { Report } = require("../../../common/report");

const timeout = 60 * 1000;

const r = new Report("j155");


function linstener(response) {
  let url = response.url();
  let status = response.status();

  //alreay sub
  if (status === 302 && url.startsWith("https://www.mobimaniac.mobi:443/fp/return/error")) {

    r.w("failure", url)

  }

  // http://pgw.wap.net-m.net/pgw/io/cp/reply0uupc/89/1589530504?result=OK
  if (status === 302 && url.endsWith("result=OK")) {

    r.s("success")

  }
}

async function run(m) {

  //sub status linstener
  m._page.on('response', linstener)

  try {

    r.i("start")

    await m.get(`http://lsl.allcpx.com/offer/track/147`, { timeout });

    //等待页面加载完成
    await m._page.waitForResponse(response => {
      let url = response.url();
      let method = response.request().method();
      return url.startsWith("https://bam.nr-data.net")

    });

    saveFile(`./pages/h3g/${info.deviceid}/1.html`, await m._page.content());

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

    saveFile(`./pages/h3g/at/${info.deviceid}/2.html`, await m._page.content());

    r.i("step2")

    //第二次点击
    await m.tapElement("input[name='submit']");

    //等待页面加载完成
    await m._page.waitForResponse(response => {
      let url = response.url();
      return url.startsWith("https://www.mobimaniac.mobi")
    }, { timeout });

    saveFile(`./pages/h3g/at/${info.deviceid}/3.html`, await m._page.content());

  } catch (e) {

    saveFile(`./pages/h3g/at/${info.deviceid}/error.html`, await m._page.content());

    r.e("error", e + "")

  } finally {
    m.close();
  }
}

module.exports = { run }
