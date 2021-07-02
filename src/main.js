const puppeteer = require("puppeteer");
const { FORM_ID, ENTRIES, TOTAL, PARALLLEL, SPAN } = require("./config.js");

async function main() {
    const browser = await puppeteer.launch({
        headless: false,
        args: ["--disable-web-security", "--disable-features=IsolateOrigins,site-per-process"],
    });

    for (let i = 0; i < TOTAL; ) {
        let tasks = [];
        for (let j = 0; i < TOTAL && j < PARALLLEL; j++, i++) {
            tasks.push(run(browser).catch(console.log));
        }
        await Promise.all(tasks);
        console.log(`\n>>>>>> ${i} times have finished. <<<<<<\n`);
        await sleep(Math.floor(Math.random() * Math.abs(SPAN[0] - (SPAN[1] || SPAN[0])) + Math.min(...SPAN)));
    }

    await browser.close();
}

async function run(browser) {
    const context = await browser.createIncognitoBrowserContext();
    const page = await context.newPage();
    await page.setUserAgent((await browser.userAgent()).replace("Headless", "") + ` TimeMachine/${Date.now()}`);

    let query = new URLSearchParams();
    ENTRIES.forEach((entry) => {
        query.set(`entry.${entry.id}`, rand_opt(entry.options));
    });

    const url = `https://docs.google.com/forms/d/e/${FORM_ID}/viewform?${query.toString()}`;
    console.log({
        url: decodeURIComponent(url),
        form: FORM_ID,
        data: [...query.entries()],
    });
    await page.goto(url);
    await page.waitForTimeout(3000);

    while ((await page.$$("div[role=button].appsMaterialWizButtonEl")).length) {
        let elm = (await page.$$("div[role=button].appsMaterialWizButtonEl"))[(await page.$$("div[role=button].appsMaterialWizButtonEl")).length - 1];
        await elm.click();

        await page.waitForTimeout(3000);
    }

    await page.close();
    await context.close();
}

function sleep(t = 1000) {
    return new Promise((r) => setTimeout(r, t));
}

function rand_opt(opts) {
    return opts[Math.floor(Math.random() * opts.length)];
}

exports.main = main;
