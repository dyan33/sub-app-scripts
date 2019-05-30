const mobile = require("./common/mobile");
const util = require("./common/util");

(async () => {
  const info = util.info();

  const m = await mobile.start({
    headless: true,
    devtools: false,
    ignoreHTTPSErrors: true,
    env: {
      TZ: info.timezone,
      ...process.env
    },
    args: ["--incognito", `--proxy-server=${info.proxy}`, `--lang=${info.lang}`]
  });

  try {
    await m.get(`http://www.baidu.com`, { timeout: 60 * 1000 });
  } catch (e) {
    console.log(e);
  } finally {
    m.close();
  }
})();
