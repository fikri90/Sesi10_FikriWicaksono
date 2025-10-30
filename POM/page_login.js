// const { By } = require('selenium-webdriver'); // tanpa ES Module
import { By } from "selenium-webdriver"; // ES Module

// membuat class berisi variabel Locator
class PageLogin {
    // menggunakan static agar value tidak dapat diubah di tempat lain
    static inputUsername = By.css('[data-test="username"]');
    static inputPassword = By.xpath('//*[@data-test="password"]');
    static buttonLogin = By.css('.submit-button.btn_action');
}

// module.exports = PageLogin; // export agar bisa dipanggil 

// convert ke ES Module
export default PageLogin;