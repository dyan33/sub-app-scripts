const puppeteer = require("puppeteer");
const devices = require("puppeteer/DeviceDescriptors");
const process = require("process");

class Mobile {
  constructor(browser, page, client) {
    this._browser = browser;
    this._page = page;
    this._client = client;
  }

  //屏幕方向
  async orientation(alpha, beta, gamma) {
    // await client.send("DeviceOrientation.clearDeviceOrientationOverride");
    await this._client.send("DeviceOrientation.setDeviceOrientationOverride", {
      alpha,
      beta,
      gamma
    });
  }

  //触摸
  async tap(x, y) {
    //windows刷新第一帧会丢失touch事件,第二帧刷新后执行touch事件
    await this._client.send("Runtime.evaluate", {
      expression:
        "new Promise(x => requestAnimationFrame(() => requestAnimationFrame(x)))",
      awaitPromise: true
    });

    const touchPoints = [
      {
        x,
        y,
        radiusX: 32.73999786376953,
        radiusY: 32.73999786376953,
        force: 0.837500023841858
      }
    ];
    await this._client.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints
    });
    await this._client.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: []
    });
  }

  async get(url, options) {
    await this._page.goto(url, options);
  }

  async sleep(milliscond) {
    await this._page.waitFor(milliscond);
  }

  async evaluate(func, ...args) {
    return await this._page.evaluate(func, ...args);
  }

  async close() {
    await this._browser.close();
  }
}

exports.start = async function (params) {
  const browser = await puppeteer.launch(params);
  // const context = await browser.createIncognitoBrowserContext();

  // const page = await context.newPage();
  const [page] = await browser.pages();

  page.on("response", (response) => {

    let code = response.status();

    if (code === 555) {
      console.log("主动中断脚本执行!")
      process.exit(0)
    }

  })

  await page.emulate(devices["Nexus 5"]);

  const client = await page.target().createCDPSession();

  return new Mobile(browser, page, client);
};
