import { writeFile } from "node:fs/promises"; 
import { chromium } from "playwright";
// Humanizing to beat Anti-bots
const randomDelay = (min = 3, max = 8) => {
    const ms = (Math.random() * (max - min) + min) * 1000;
    return new Promise(res => setTimeout(res, ms));
}

async function savepData(menuData) {
    try {
        await writeFile("output/sample_menu.json", JSON.stringify(menuData, null, 4), "utf-8");
        console.log("[+] Data recorded successfully to output/bazooka_menu.json");
    } catch (fsError) {
        console.error("[-] Failed to save data file:", fsError.message);
    }
}

async function run() {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        viewport: { width: 1920, height: 1080 },
        locale: 'en-US',
        timezoneId: 'Africa/Cairo'
    });
    
    const page = await context.newPage();
    await page.route('**/*.{png,jpg,jpeg,svg,css}', route => route.abort());
    await page.addInitScript(() => {
        Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
    });

    try {
        await page.goto("https://bazookaegy.com/ar/resturant/bazooka-nasr-city-tayran", { 
            waitUntil: 'networkidle',
            timeout: 60000
        });
    } catch (networkError) {
        console.error("[-] Critical Network Error: Cannot open the website.", networkError.message);
        await browser.close();
        return; 
    }

    let menuData = [];

    try {
        const categoriesNum = await page.locator("[id='myTabContent'] .tab-pane ").count();
        const categories = page.locator('[id="myTabContent"] .tab-pane');
        // Loop on categories
        for (let i = 0; i < categoriesNum; i++) {
            try {
                const choosenCategori = categories.nth(i);
                const items = choosenCategori.locator('.col-sm-12');
                const fullID = await choosenCategori.getAttribute('id'); 
                const categoriButtonID = fullID ? fullID.split("-")[0] : "";
                const categoriName = await page.locator(`[id="myTab"] [id="${categoriButtonID}"]`).textContent();
                
                const cleanCategoryName = categoriName ? categoriName.trim() : `Category_${i}`;
                console.log(`[*] Scraping Category: ${cleanCategoryName}`);
    
                const categoryItems = [];
                const itemsCount = await items.count();
                //Loop on items in each category
                for (let j = 0; j < itemsCount; j++) {
                    try {
                        const choosenItem = items.nth(j);
                        const itemImg = await choosenItem.locator('.media-img img').getAttribute('data-src').catch(() => null);
                        const itemName = await choosenItem.locator('h5').textContent().catch(() => "Unknown");
                        const itemDescription = await choosenItem.locator('p').first().textContent().catch(() => "");
                        
                        let itemPrice = "dont exist";
                        let oldItemPrice = "dont exist";
                        let prices = [];
                        
                        const normCategory = cleanCategoryName.toLowerCase();
                        //Only offer category 
                        if (normCategory.includes('offer') || normCategory.includes('عرض') || normCategory.includes('العروض')) {
                            itemPrice = await choosenItem.locator('.media-end span').first().textContent().catch(() => "dont exist");
                            oldItemPrice = await choosenItem.locator('.media-end [style="text-decoration: line-through;"]').textContent().catch(() => "dont exist");
                        }
                        //Other categories 
                        else {
                            const numKinds = await choosenItem.locator('.media-end .crosshairs').count();
                            let kind = "Unified Size";
                            let kindPrice = " 0 ";
                            // Items with only one size
                            if (numKinds == 0) {
                                kindPrice = await choosenItem.locator('.media-end span').textContent().catch(() => "0");
                                prices.push({
                                    kind: kind.trim(),
                                    kindPrice: kindPrice.trim()
                                });
                            } 
                            //Items with malti sizes
                            else {
                                for (let z = 0; z < numKinds; z++) {
                                    const choosenPrice = choosenItem.locator('.media-end div').nth(z);
                                    kind = await choosenPrice.locator('span').first().textContent().catch(() => "Unified Size");
                                    kindPrice = await choosenPrice.locator('span').nth(1).textContent().catch(() => "0");
                                    prices.push({
                                        kind: kind.trim(),
                                        kindPrice: kindPrice.trim()
                                    });
                                }
                            }
                        }
                        categoryItems.push({
                            name: itemName ? itemName.trim() : "Unknown Item",
                            image: itemImg ? itemImg.trim() : null,
                            description: itemDescription ? itemDescription.trim() : null,
                            hasMultiplePrices: prices.length > 0,
                            price: prices.length > 0 ? null : itemPrice.trim(),
                            oldPrice: prices.length > 0 ? null : oldItemPrice.trim(),
                            prices: prices.length > 0 ? prices : null
                        });
                        console.log(`* Item ${j} done succesfully`)

                    } catch (itemError) {
                        console.error(`[-] Failed to scrape item index ${j} in ${cleanCategoryName}:`, itemError.message);
                    }
                }
                console.log("#############################################################################################");
                
                menuData.push({
                    category: cleanCategoryName,
                    totalItems: categoryItems.length,
                    items: categoryItems
                });
                await randomDelay(1, 3);
            } catch (categoryError) {
                console.error(`[-] Error in category index ${i}:`, categoryError.message);
            }
        }
    } catch (mainLoopError) {
        console.error("[-] Critical Unexpected Loop Error:", mainLoopError.message);
    } finally {
        await savepData(menuData);
        await browser.close();
        console.log("[*] Browser closed safely.");
    }
}

run();