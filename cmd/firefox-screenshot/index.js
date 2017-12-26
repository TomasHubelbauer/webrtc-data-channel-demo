const webdriver = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');
const path = require('path');

const binary = new firefox.Binary(firefox.Channel.RELEASE);
binary.addArguments('--headless');

const driver = new webdriver.Builder().forBrowser('firefox').setFirefoxOptions(new firefox.Options().setBinary(binary)).build();

// Figure out where to read demo index from and save screenshot and console to.
const demo = process.argv[2];
const directoryPath = path.join(__dirname, `../../src/${demo}`);

driver.get('file://' + path.join(directoryPath, 'index.html'));

// TODO: Finalize the implementation.

driver.quit();
