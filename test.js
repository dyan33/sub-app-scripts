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

    await m.sms(text => { console.log("短信", text) })
    await m.sms(text => { console.log("短信", text) })
    await m.sms(text => { console.log("短信", text) })
    
  } catch (e) {
    console.log(e);
  } finally {
    m.close();
  }
})();
