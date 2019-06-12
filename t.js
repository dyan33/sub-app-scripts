const mobile=require("./common/mobile");


(async ()=>{

    const m = await mobile.start({
        headless: false,
        devtools: true,
        ignoreHTTPSErrors: true,
        env: {
    
          ...process.env
        },
        args: ["--incognito", `--proxy-server=127.0.0.1:8020`]
      });



      await m.get("file:///C:/Users/CPX/test/sub-app-scripts/pages/th/thm/8f9f7e9a8a0f165e/1.html")


      await m.sleep(10*60*1000)


})()