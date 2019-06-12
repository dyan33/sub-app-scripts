//奥地利h3g

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
    await m.get(`http://lsl.allcpx.com/offer/track/147`, {
      timeout: 60*1000,
    });

    //https://js-agent.newrelic.com:443/nr-1123.min.js
    //等待页面加载完成
    await m._page.waitForResponse(response => {
      let url = response.url();
      let method = response.request().method();
      return url.startsWith("https://bam.nr-data.net")

    });

    util.saveFile(
      `./pages/h3g/${info.deviceid}/1.html`,
      await m._page.content()
    );


    //第一次点击
    await m.tapElement("#form_click_submit");

    //https://www.pages06.net/WTS/event.jpeg
    //等待页面加载完成
    await m._page.waitForResponse(response => {
      let url = response.url();
      let method = response.request().method();
      return url.startsWith("https://www.pages06.net/WTS/event.jpeg")

    },{timeout:60*1000});

    //email是否为空
    await m._page.evaluate((aid)=>{

        let input=document.getElementById("email");
        let email=input.getAttribute("value");
        if(!email){
          input.setAttribute("value",`${aid}@gmail.com`)
        }

    },info.deviceid)

    util.saveFile(
      `./pages/h3g/${info.deviceid}/2.html`,
      await m._page.content()
    );

    //sub status linstener
    m._page.on('response',(response)=>{
        let url=response.url();
        let status=response.status();

        // http://pgw.wap.net-m.net/pgw/io/cp/reply0uupc/89/1589530504?result=OK
        if(status===302&&url.endsWith("result=OK")){
          //sub success
        }

    })
    

    //第二次点击
    await m.tapElement("input[name='submit']");

    await m.sleep(30 * 60 * 1000);

  } catch (e) {
    console.log(e);
    util.saveFile(`./pages/h3g/${info.deviceid}/error.html`,await m._page.content());
  } finally {
    m.close();
  }
})();
