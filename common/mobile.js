const puppeteer = require("puppeteer");
const devices = require("puppeteer/DeviceDescriptors");
const process = require("process");
const axios = require("axios");
const util = require("./util");

class Mobile {
  constructor(browser, page, client, proxy) {
    this._browser = browser;
    this._page = page;
    this._client = client;
    this._proxy = proxy;
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

  //点击id
  async tapElement(selector) {

    function find_element(selector) {
      let a = document.querySelector(selector).getBoundingClientRect();
      return {
        x1: a.left + 10,
        x2: a.right - 10,
        y1: a.top + 10,
        y2: a.bottom - 10
      };
    }

    let btn = await this._page.evaluate(find_element, selector);

    let x = util.random(btn.x1, btn.x2);
    let y = util.random(btn.y1, btn.y2);

    await this.tap(x, y);
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

  async sms(callback) {
    let resp = await axios.get("http://sms", {
      proxy: this._proxy,
      timeout: 60 * 1000
    });
    await callback(resp.data);
  }
}

exports.start = async function (params) {
  const browser = await puppeteer.launch(params);
  // const context = await browser.createIncognitoBrowserContext();
  // const page = await context.newPage();
  const [page] = await browser.pages();

  page.on("response", response => {
    let code = response.status();

    if (code === 555) {
      console.log("主动中断脚本执行!");
      process.exit(0);
    }
  });

  await page.emulate(devices["Nexus 5"]);

  const client = await page.target().createCDPSession();

  //获取代理
  let proxy;
  if (params.args) {
    for (const str of params.args) {
      if (str.startsWith("--proxy-server=")) {
        const port = str.split(":")[1];
        proxy = {
          host: "127.0.0.1",
          port
        };
        break;
      }
    }
  }

  return new Mobile(browser, page, client, proxy);
};
