const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function capture() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Figure out where to read demo index from and save screenshot and console to.
  const demo = process.argv[2];
  const directoryPath = path.join(__dirname, `../../src/${demo}`);

  // Capture output of console.log, console.error etc.
  let output = '';
  page.on('console', event => output += event.text + '\n');

  // Simulate the desired demo scenario.
  await page.goto('file://' + path.join(directoryPath, 'index.html'), { waitUntil: 'load' });
  switch (demo) {
    case 'offerer-answerer': {
      // Assume 2 frames as it is hardcoded and skip main page frame.
      const frames = await page.frames();

      // Wait for WebRTC connection to be established (fast on local network).
      await page.waitFor(100);

      // Connect offerer + answerer and exchange messages.
      const offererMessageInput = await frames[1].$('#messageInput');
      const answererMessageInput = await frames[2].$('#messageInput');

      offererMessageInput.focus();
      await page.keyboard.type('Hello from offerer to answerer.');
      await page.keyboard.press('Enter');

      answererMessageInput.focus();
      await page.keyboard.type('Hello from answerer to offerer.');
      await page.keyboard.press('Enter');

      // Accommodate page size to make frames fully visible.
      await page.setViewport({ width: 800, height: 300 });
      break;
    }
    case 'peer': {
      // Assume 4 frames as it is hardcoded and skip main page frame.
      const frames = await page.frames();

      // Connect A1 + B2 and exchange messages.
      const a1ConnectButton = await frames[1].$('#connectB2Button');
      const a1MessageInput = await frames[1].$('#messageInput');
      const b2MessageInput = await frames[4].$('#messageInput');
      a1ConnectButton.click();

      // Wait for WebRTC connection to be established (fast on local network).
      await page.waitFor(100);

      a1MessageInput.focus();
      await page.keyboard.type('Hello from A1 to B2.');
      await page.keyboard.press('Enter');

      b2MessageInput.focus();
      await page.keyboard.type('Hello from B2 to A1.');
      await page.keyboard.press('Enter');

      // Connect B1 + A2 and exchange messages.
      const b1ConnectButton = await frames[3].$('#connectA2Button');
      const b1MessageInput = await frames[3].$('#messageInput');
      const a2MessageInput = await frames[2].$('#messageInput');
      b1ConnectButton.click();

      // Wait for WebRTC connection to be established (fast on local network).
      await page.waitFor(100);

      b1MessageInput.focus();
      await page.keyboard.type('Hello from B1 to A2.');
      await page.keyboard.press('Enter');

      a2MessageInput.focus();
      await page.keyboard.type('Hello from A2 to B1.');
      await page.keyboard.press('Enter');

      // Accommodate page size to make frames fully visible.
      await page.setViewport({ width: 800, height: 700 });
      break;
    }
    default: {
      throw new Error(`Unsupported demo scenario ${demo}.`);
    }
  }

  // Capture the screenshot.
  await page.screenshot({ path: path.join(directoryPath, 'screenshot.png'), fullPage: true });
  await browser.close();
  
  // Capute the console output.
  fs.writeFileSync(path.join(directoryPath, 'console.log'), output);
}

capture();
