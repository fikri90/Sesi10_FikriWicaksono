const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');
const { inputFormLogin } = require('../helper/form-login.js'); // helper login

describe('SauceDemo Automation', function () {
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

        // membuka situs saucedemo
        await driver.get('https://www.saucedemo.com');

        // login sebelum test dengan memanggil function form-login.js
        await inputFormLogin(driver, 'standard_user', 'secret_sauce');
    });

    // tutup 
    afterEach(async function () {
        if (driver) {
            await driver.quit();
            console.log('Browser ditutup setelah test');
        }
    });

    it('Test Case 1 - Login sukses dengan valid password', async function () {
        const title = await driver.getTitle();
        assert.strictEqual(title, 'Swag Labs');
        console.log('Validasi title Swag Labs berhasil');

        await driver.sleep(1000); // pakai sleep agar freeze sebentar untuk cek dan debug
    });

    it('Test Case 2 - Sort produk Low to High', async function () {
        // Tunggu dropdown sortir muncul
        const dropdownSort = await driver.wait(
            until.elementLocated(By.css('[data-test="product-sort-container"]')),
            10000
        );

        // Klik dan pilih "Price (low to high)"
        await dropdownSort.click();
        const priceLowToHigh = await driver.findElement(By.xpath('//option[text()="Price (low to high)"]'));
        await priceLowToHigh.click();
        console.log('Dropdown diubah ke "Price (low to high)".');

        await driver.sleep(1000); // pakai sleep agar freeze sebentar untuk cek dan debug

        const firstPrice = await driver.findElement(By.css('.inventory_item_price'));
        const priceText = await firstPrice.getText(); // misal "$7.99"
        assert.ok(priceText.includes('$')); // minimal cek pricenya udah sesuai apa belum

        await driver.sleep(1000);
    });
});
