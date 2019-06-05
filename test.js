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

      await m._page.type("#index-kw", "测试")
      await m.sleep(10*1000)
      await m.tapElement("#index-bn")

      await m.sleep(60 * 1000)
    }
    await m.sms(parseSms);
  } catch (e) {
    console.log(e);
  } finally {
    m.close();
  }
})();
