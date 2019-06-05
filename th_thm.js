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
    await m.get(`http://preie.com/tmg?affName=cpx_ld`, {
      timeout: 60 * 1000
    });

    await m.sleep(5 * 1000);

    util.saveFile(
      `./pages/th/thm/${info.deviceid}/1.html`,
      await m._page.content()
    );
  } catch (e) {
    console.log(e);
  } finally {
    m.close();
  }
})();
