const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');

describe('SauceDemo Automation', function () {
    let driver;

    it('Test Case 1 - Login sukse dengan valid password', async function () {
        // kenapa pake serviceBuilder? karena chromedrivernya pakai yang v141, jadi harus setting pathnya yang sesuai juga
        const service = new chrome.ServiceBuilder('C:\\Users\\ThinkPad\\Downloads\\chromedriver-win64\\chromedriver.exe');
        const options = new chrome.Options();
        options.addArguments('--incognito');

        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .setChromeService(service)
            .build();

        await driver.get('https://www.saucedemo.com');

        // input username dan password
        const inputUsername = await driver.findElement(By.css('[data-test="username"]'));
        const inputPassword = await driver.findElement(By.xpath('//*[@data-test="password"]'));
        const buttonLogin = await driver.findElement(By.css('.submit-button.btn_action'));

        await inputUsername.sendKeys('standard_user');
        await inputPassword.sendKeys('secret_sauce');
        await buttonLogin.click();

        const title = await driver.getTitle();
        assert.strictEqual(title, 'Swag Labs');
        await driver.sleep(2000); // pakai sleep agar freeze sebentar untuk cek dan debug

    });

    it('Test case 2 - Sort produk Low to High', async function () {
        const service = new chrome.ServiceBuilder('C:\\Users\\ThinkPad\\Downloads\\chromedriver-win64\\chromedriver.exe');
        const options = new chrome.Options();
        options.addArguments('--incognito');

        // menunggu sampai produk muncul
        const dropdownSort = await driver.wait(
            until.elementLocated(By.css('[data-test="product-sort-container"]')),
            10000
        );

        // mensortir produk dengan price low to high
        await dropdownSort.click();
        const priceLowToHigh = await driver.findElement(By.xpath('//option[text()="Price (low to high)"]'));
        await priceLowToHigh.click();
        await driver.sleep(2000); // pakai sleep agar freeze sebentar untuk cek dan debug

        // cek element pertama harganya paling murah
        const firstPrice = await driver.findElement(By.css('.inventory_item_price'));

        const priceText = await firstPrice.getText(); // misal "$7.99"
        assert.ok(priceText.includes('$')); // minimal cek ada price
        await driver.sleep(2000);

        await driver.quit();

    });

});
