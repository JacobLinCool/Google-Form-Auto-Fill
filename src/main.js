const puppeteer = require("puppeteer");

const FORM_ID = "1FAIpQLSezLejnMEtJmLFc90X2-_PJWjoPieL4lXgQsU7uo6nNnWDCTQ";
const ENTRIES = [
    {
        id: "357040719",
        options: ["女", "男"],
    },
    {
        id: "531316100",
        options: ["15歲以下", "16~18", "16~18", "16~18", "19~29"],
    },
    {
        id: "215160651",
        options: ["是", "否", "否", "否"],
    },
    {
        id: "97026815",
        options: ["否"],
    },
    {
        id: "1170631987",
        options: ["是", "否"],
    },
    {
        id: "302580551",
        options: ["是", "否"],
    },
    {
        id: "1352058818",
        options: ["是", "否"],
    },
    {
        id: "496740190",
        options: ["是", "否"],
    },
    {
        id: "1599054748",
        options: ["上午十一點", "下午一點", "下午三點", "下午五點"],
    },
    {
        id: "347617688",
        options: ["半小時內", "半小時到一小時", "一小時到一個半小時", "一個半小時到兩個小時"],
    },
];
const TOTAL = 100;
const PARALLLEL = 5;
const SPAN = [15 * 1000, 60 * 1000];

async function main() {
    const browser = await puppeteer.launch({
        headless: true,
        args: ["--disable-web-security", "--disable-features=IsolateOrigins,site-per-process"],
    });

    for (let i = 0; i < TOTAL; ) {
        let tasks = [];
        for (let j = 0; i < TOTAL && j < PARALLLEL; j++, i++) {
            tasks.push(run(browser).catch(console.log));
        }
        await Promise.all(tasks);
        console.log(`\n>>>>>> ${i} times have finished. <<<<<<\n`);
        await sleep(Math.floor(Math.random() * Math.abs(SPAN[0] - (SPAN[1] || SPAN[0])) + Math.min(SPAN)));
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

    while ((await page.$$("div[role=button]")).length > 1) {
        if ((await page.$$("div[role=button]")).length === 2) await page.click("div[role=button]");
        else await page.click("div[role=button]:nth-child(2)");

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
