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
    await m.sleep(10 * 1000);

    await m.get(`http://all.sea-limited.com/th/offer/30005`, {
      timeout: 60 * 1000
    });

    await m.sleep(1000);

    util.saveFile(`./pages/ais/${info.deviceid}/1.html`, await m._page.content());

    //第一次点击
    await m.tapElement("#btn-ReqOTP");

    async function parseSms(text) {
      let code = text.substr(30, 4);

      if (text.startsWith("You OTP")) {
        code = text.substr(40, 4);
      }

      if (code && code.length == 4 && Number(code)) {
        //填入文本
        await m._page.type("#otp-box", code);

        await m.sleep(500);

        //确认订阅
        await m.tapElement("#btn-ConfirmOTP");
      } else {
        console.log("error message", text);
        await m.sms(parseSms);
      }
    }

    await m.sms(parseSms);

    await m.sleep(1000);
  } catch (e) {
    console.log(e);
  } finally {
    m.close();
  }
})();
