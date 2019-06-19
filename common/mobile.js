const devices = require("puppeteer/DeviceDescriptors");
const process = require("process");
const axios = require("axios");
const { random, info } = require("./util");

const timeout = 60 * 1000;

const proxy = {
   host: "127.0.0.1",
    port: info.proxy.split(":")[1] 
  }

const config = {
  headless: false,
  devtools: true,
  ignoreHTTPSErrors: true,
  env: {
    TZ: info.timezone,
    ...process.env
  },
  args: ["--incognito", `--proxy-server=${info.proxy}`, `--lang=${info.lang}`]
}

class Mobile {
  constructor(page, client) {
    this._page = page;
    this._client = client;

    this._page.setDefaultTimeout(timeout);

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

  //触摸元素
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

    let x = random(btn.x1, btn.x2);
    let y = random(btn.y1, btn.y2);

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

  //关闭页面
  async close() {
    if (!this._page.isClosed()){
      await this._page.close();
    }
  }

  //短信息
  async sms(callback) {
    try {
      let resp = await axios.get("http://sms", { proxy, timeout });
      await callback(resp.data);
    } catch (e) {
      console.log(e);
    }
  }
}

async function newWindow(browser){
  const context = await browser.createIncognitoBrowserContext();
  return await context.newPage();
}

async function createMobile(page){

  //通道关闭监听
  page.on("response", response => {
    if ( response.status() === 555) {
      console.log("proxy chanel already closed!");
      process.exit(0);
    }
  });

  await page.emulate(devices["Nexus 5"]);

  const client = await page.target().createCDPSession();

  return new Mobile(page, client);
}

module.exports={
  config,
  createMobile,
  newWindow
}
