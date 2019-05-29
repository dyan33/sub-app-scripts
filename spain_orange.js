const mobile = require("./common/mobile");
(async () => {
  const args = process.argv.splice(2);

  const proxy = args[0];
  const lang = args[1];

  const url =
    "http://offer.allcpx.com/offer/track?offer=271&clickId={click_id}&pubId={pub_id}&o={other_data}";

  const m = await mobile.start({
    headless: false,
    devtools: true,
    ignoreHTTPSErrors: false,
    args: [`--proxy-server=${proxy}`, `--lang=${lang}`]
  });

  try {
    await m.get(url, { timeout: 60 * 1000 });

    //休息3秒
    await m.sleep(5 * 1000);

    console.log("开始点击");

    //第一次点击
    let b = await m.evaluate(() => {
      let btn = document
        .getElementById("btn_continuar")
        .getBoundingClientRect();

      return {
        x1: btn.left + 10,
        x2: btn.right - 10,
        y1: btn.top + 10,
        y2: btn.bottom - 10
      };
    });

    let x = mobile.random(b.x1, b.x2);
    let y = mobile.random(b.y1, b.y2);

    console.log("点击1", x, y);
    await m.tap(x, y);
    await m.orientation(0, 90, mobile.random(10, 20));

    //休息500ms
    await m.sleep(500);

    //第二次点击
    let b2 = await m.evaluate(() => {
      let btn = document
        .getElementById("btn_popup_der")
        .getBoundingClientRect();

      return {
        x1: btn.left + 20,
        x2: btn.right - 20,
        y1: btn.top + 10,
        y2: btn.bottom - 10
      };
    });

    let x2 = mobile.random(b2.x1, b2.x2);
    let y2 = mobile.random(b2.y1, b2.y2);

    console.log("点击2", x2, y2);
    await m.tap(x2, y2);
    await m.orientation(0, 90, mobile.random(10, 20));

    //休息60s
    //await m.sleep(60 * 1000);
  } catch (e) {
    console.log(e);
  } finally {
    await m.close();
  }
})();
