const puppeteer = require("puppeteer-core");

async function main() {
    for (let i = 0; i < 100; i++) {
        await run().catch(console.log);
        await sleep(Math.random() * 15 * 1000);
    }
}

async function run() {
    let browser = await puppeteer.launch({
        executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        headless: true,
        args: ["--disable-web-security", "--disable-features=IsolateOrigins,site-per-process"],
    });
    let page = await browser.newPage();
    await page.goto(
        `https://docs.google.com/forms/d/e/1FAIpQLSezLejnMEtJmLFc90X2-_PJWjoPieL4lXgQsU7uo6nNnWDCTQ/viewform?entry.357040719=${rand_opt([
            "女",
            "男",
        ])}&entry.531316100=${rand_opt(["15歲以下", "16~18", "16~18", "16~18", "19~29"])}&entry.215160651=${rand_opt([
            "是",
            "否",
            "否",
            "否",
        ])}&entry.97026815=${rand_opt(["否"])}&entry.1170631987=${rand_opt(["是", "否"])}&entry.302580551=${rand_opt(["是", "否"])}&entry.1352058818=${rand_opt(
            ["是", "否"]
        )}&entry.496740190=${rand_opt(["是", "否"])}&entry.1599054748=${rand_opt([
            "上午十一點",
            "下午一點",
            "下午三點",
            "下午五點",
        ])}&entry.347617688=${rand_opt(["半小時內", "半小時到一小時", "一小時到一個半小時", "一個半小時到兩個小時"])}`
    );
    await page.waitForTimeout(5000);
    await page.click("div[role=button]");
    await page.waitForTimeout(5000);
    await page.click("div[role=button]:nth-child(2)");
    await page.waitForTimeout(5000);
    await page.click("div[role=button]:nth-child(2)");
    await page.waitForTimeout(5000);
    await page.close();
    await browser.close();
}

function sleep(t = 1000) {
    return new Promise((r) => setTimeout(r, t));
}

function rand_opt(opts) {
    return opts[Math.floor(Math.random() * opts.length)];
}

exports.main = main;
