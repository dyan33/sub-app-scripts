const mobile = require("./common/mobile");
const util = require("./common/util");

(async () => {
  const info = util.info();

  const m = await mobile.start({
    headless: false,
    devtools: false,
    ignoreHTTPSErrors: false,
    env: {
      TZ: info.timezone,
      ...process.env
    },
    args: ["--incognito", `--proxy-server=${info.proxy}`, `--lang=${info.lang}`]
  });

  try {
    await m.get(`https://www.baidu.com`, { timeout: 60 * 1000 });

    await m._page.waitForResponse(response => {
      let url = response.url();
      let method = response.request().method();
      return true;
    });

    async function parseSms(text) {
      let code = text.substr(30, 4);
      if (code && code.length == 4 && Number(code)) {
        await m._page.evaluate(code => alert(code), code);
      } else {
        console.log("error message", text);
        await m.sms(parseSms);
      }
    }
    await m.sms(parseSms);
  } catch (e) {
    console.log(e);
  } finally {
    m.close();
  }
})();
