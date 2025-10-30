import { Builder, By, until } from "selenium-webdriver";
import chrome from 'selenium-webdriver/chrome.js';
import assert from 'assert';
import PageLogin from "../POM/page_login.js";
import { Buffer } from "buffer";
import fs from "fs";
import Pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

describe('SauceDemo Automation dengan ES Module', function () {
    this.timeout(60000); // atur timeout global
    let driver;

    beforeEach(async function () {
        // Setup chrome
        const service = new chrome.ServiceBuilder('C:\\Users\\ThinkPad\\Downloads\\chromedriver-win64\\chromedriver.exe');
        const options = new chrome.Options();
        options.addArguments('--incognito');
        // options.addArguments('--headless'); // aktifkan kalau mau tanpa tampilan

        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .setChromeService(service)
            .build();

        await driver.get('https://www.saucedemo.com');
        console.log('Browser membuka halaman SauceDemo');

        // login sebelum test dengan memanggil class POM
        let inputUsernamePOM = await driver.findElement(PageLogin.inputUsername);
        let inputPasswordPOM = await driver.findElement(PageLogin.inputPassword);
        let buttonLoginPOM = await driver.findElement(PageLogin.buttonLogin);
        await inputUsernamePOM.sendKeys('standard_user');
        await inputPasswordPOM.sendKeys('secret_sauce');
        await buttonLoginPOM.click();
    });

    // tutup browser setiap selesai menjalankan test case
    afterEach(async function () {
        if (driver) {
            await driver.quit();
            console.log('Browser ditutup setelah test');
        }
    });

    it('Test case 1 - Visual Test', async function () {
        // ss keadaan login sekarang, current.pgn
        let screenshot = await driver.takeScreenshot();
        let imgBuffer = Buffer.from(screenshot, 'base64');
        fs.writeFileSync("current.png", imgBuffer);

        // ambil baseline untuk komparasi
        // jika belum ada, jadikan current.png  sebagai baseline
        if (!fs.existsSync("baseline.png")) {
            fs.copyFileSync("current.png", "baseline.png");
            console.log("baseline image saved.");
        }

        // compare baseline.png dan current.png apakah sama
        let img1 = PNG.sync.read(fs.readFileSync("baseline.png"));
        let img2 = PNG.sync.read(fs.readFileSync("current.png"));
        let { width, height } = img1;
        let diff = new PNG({ width, height });

        let numbDiffPixels = Pixelmatch(img1.data, img2.data, diff.data, width, height, { threshold: 0.1 });

        fs.writeFileSync("diff.png", PNG.sync.write(diff));

        if (numbDiffPixels > 0) {
            console.log(`Visual differences found! Pixels is different: ${numbDiffPixels}`);
        } else {
            console.log("No visual differences found.");
        }
    });

    it('Test Case 1 - Login sukses dengan valid password', async function () {
        // menunggu sampai icon cart muncul (validasi user berhasil login)
        await driver.wait(until.elementsLocated(By.css('[data-test="shopping-cart-link"]')), 10000);

        // validasi = tulisan 'Swag Labs' berhasil muncul
        const title = await driver.getTitle();
        assert.strictEqual(title, 'Swag Labs');

        // Screenshot setelah login berhasil
        const ss_full = await driver.takeScreenshot();
        fs.writeFileSync("captures/Full_tc1.png", Buffer.from(ss_full, "base64"));

        // await driver.sleep(1000); // pakai sleep agar freeze sebentar untuk cek dan debug 
    });

    it('Test Case 2 - Sort produk Low to High', async function () {
        // menunggu icon dropdown sortir muncul
        const dropdownSort = await driver.wait(
            until.elementLocated(By.css('[data-test="product-sort-container"]')),
            1000
        );

        // klik dan pilih "Price (low to high)"
        await dropdownSort.click();
        const priceLowToHigh = await driver.findElement(By.xpath('//option[text()="Price (low to high)"]'));
        await priceLowToHigh.click();

        // await driver.sleep(1000); // pakai sleep agar freeze sebentar untuk cek dan debug

        const firstPrice = await driver.findElement(By.css('.inventory_item_price'));
        const priceText = await firstPrice.getText();
        assert.ok(priceText.includes('$')); // minimal cek pricenya udah sesuai apa belum

        // Screenshot product sudah tersortir "Price low to high"
        const ss_full = await driver.takeScreenshot();
        fs.writeFileSync("captures/Full_tc2.png", Buffer.from(ss_full, "base64"));

        // await driver.sleep(1000);
    });
});
