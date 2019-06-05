//泰国AIS

const mobile = require("./common/mobile");
const util = require("./common/util");

(async () => {
  const info = util.info();

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

  try {

    //test
    await m.sleep(10*1000)

    await m.get(
      `http://all.sea-limited.com/th/offer/30005`,
      { timeout: 60 * 1000 }
    );


    //等待页面加载完成
    // await m._page.waitForResponse(response => {
    //   let url = response.url();
    //   let method = response.request().method();
    //   return url==="http://ss1.mobilelife.co.th/js/main.js"
    // });
    //sleep 1
    await m.sleep(1000)

    util.saveFile(`./pages/ais/${info.deviceid}/1.html`, await m._page.content());

    //第一次点击
    let btn = await m.evaluate(() => {
      var a = document.getElementById("btn-ReqOTP").getBoundingClientRect();
      return {
        x1: a.left + 10,
        x2: a.right - 10,
        y1: a.top + 10,
        y2: a.bottom - 10
      };
    });
    let x = util.random(btn.x1, btn.x2);
    let y = util.random(btn.y1, btn.y2);

    await m.tap(x, y);

    await m.sms(message=>{})

    await m.sleep(600*1000)

    // //此刻等待短信
    // //填写短信码
    // var textOtp = document.getElementById("en-otp-box").innerText='12345';

    //otp-box
    //btn-ConfirmOTP

    //第二次点击
    // let btn2 = await m.evaluate(() => {
    //   var a = document
    //     .getElementsByClassName("en-btn-ConfirmOTP").getBoundingClientRect();
    //   return {
    //     x1: a.left + 10,
    //     x2: a.right - 10,
    //     y1: a.top + 10,
    //     y2: a.bottom - 10
    //   };
    // });

    // let x2 = util.random(btn2.x1, btn2.x2);
    // let y2 = util.random(btn2.y1, btn2.y2);

    // await m.tap(x2, y2);
  } catch (e) {
    console.log(e);
  } finally {
    m.close();
  }
})();
