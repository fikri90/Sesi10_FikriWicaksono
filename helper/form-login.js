const {By } = require('selenium-webdriver');

async function inputFormLogin(driver, username, password) {

    const inputUsername = await driver.findElement(By.css('[data-test="username"]'))
    const inputPassword = await driver.findElement(By.xpath('//*[@data-test="password"]'))
    const buttonLogin = await driver.findElement(By.css('.submit-button.btn_action'))

    await inputUsername.sendKeys(username)
    await inputPassword.sendKeys(password)
    await buttonLogin.click();

}

module.exports = { inputFormLogin};