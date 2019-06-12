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
        await m.get(`http://fa.allcpx.com/30007?aid=${info.deviceid}&cid={clickid}`, {
            timeout: 60 * 1000
        });

        await m.sleep(1 * 1000);

        util.saveFile(
            `./pages/th/thm/${info.deviceid}/1.html`,
            await m._page.content()
        );

        //第一次点击
        await m.tapElement("#good");

        await m.sleep(1 * 1000);

        util.saveFile(`./pages/th/thm/${info.deviceid}/2.html`)



    } catch (e) {
        console.log(e);
    } finally {
        m.close();
    }
})();
