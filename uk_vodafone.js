//英国沃达丰

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
    await m.get(
      `http://mguk.foxseek.com/to/aoc?sid=889&f=304&c=${info.deviceid}`,
      { timeout: 60 * 1000 }
    );

    //等待页面加载完成
    await m._page.waitForResponse(response => {
      let url = response.url();
      let method = response.request().method();
      return (
        "POST" == method &&
        url.startsWith(
          "http://distil-live.empello.net/hevnwwwxbfhwlcls.js?PID="
        )
      );
    });

    util.saveFile(`./pages/${info.deviceid}/1.html`, await m._page.content());

    //第一次点击
    let btn = await m.evaluate(() => {
      var a = document.getElementsByClassName("btn")[0].getBoundingClientRect();
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

    //等待页面加载完成
    await m._page.waitForResponse(response => {
      let url = response.url();
      let method = response.request().method();
      return (
        "POST" == method &&
        url.startsWith(
          "http://distil-live.empello.net/hevnwwwxbfhwlcls.js?PID="
        )
      );
    });

    util.saveFile(`./pages/${info.deviceid}/2.html`, await m._page.content());

    //第二次点击
    let btn2 = await m.evaluate(() => {
      var a = document
        .getElementsByClassName("confirm_btn")[0]
        .getBoundingClientRect();
      return {
        x1: a.left + 10,
        x2: a.right - 10,
        y1: a.top + 10,
        y2: a.bottom - 10
      };
    });

    let x2 = util.random(btn2.x1, btn2.x2);
    let y2 = util.random(btn2.y1, btn2.y2);

    await m.tap(x2, y2);
  } catch (e) {
    console.log(e);
  } finally {
    m.close();
  }
})();
