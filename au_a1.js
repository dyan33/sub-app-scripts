//奥地利a1

const mobile = require("./common/mobile");
const {saveFile,info} = require("./common/util");
const { Report } = require("./common/report");

const r = new Report("h3g");

const timeout = 60 * 1000

function linstener(response) {
  let url = response.url();
  let status = response.status();

  if (url.startsWith("http://at.ifunnyhub.com")){
    r.s("success")
  }
  
}


(async () => {

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

  //sub status linstener
  m._page.on('response', linstener)

  try {

    r.i("run_a1_script")

    await m.get(`http://nat.allcpx.com/sub/start?affName=DCG&type=at_ifunny_155&clickId=${info.deviceid}`, { timeout });

    //等待页面加载完成
    await m._page.waitForSelector("button[name='confirm']",{timeout});
    await m._page.waitForSelector("#vasb-fagg-input",{timeout});

    //保存页面
    saveFile(`./pages/a1/${info.deviceid}/1.html`, await m._page.content());

    //勾选
    await m.evaluate(()=>{document.querySelector("#vasb-fagg-input").setAttribute('value',true)})

    await r.i("sub_click")

    //点击订阅按钮
    await m.tapElement("button[name='confirm']")
    
    await m.sleep(timeout)

    saveFile(`./pages/a1/${info.deviceid}/2.html`, await m._page.content());

    await r.i("end")

  } catch (e) {
    console.log(e);
    saveFile(`./pages/a1/${info.deviceid}/error.html`, await m._page.content());
    r.e(e)
  } finally {
    m.close();
  }
})();
