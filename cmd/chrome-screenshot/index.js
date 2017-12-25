const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  // TODO: See if can do fixed with and dynamic content-based height
  await page.setViewport({ width: 800, height: 600 }); // Default 800x600
  let console = '';
  page.on('console', event => {
    // TODO: `args`, `type`.
    console += event.text;
  });
  // TODO: Decide how to distinguish peer vs offerer-answerer (command line switch?)
  await page.goto('file://' + path.join(__dirname, '../../src/peer/index.html'));
  // TODO: Do user interaction setup.
  await page.screenshot({ path: 'screenshot.png' }); // TODO: Replace current screenshot in `src`
  await browser.close();
  // TODO: Save collected console messages.
})();
