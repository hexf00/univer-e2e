const express = require('express');
const { chromium } = require('playwright');
const bodyParser = require('body-parser');

const { expect } = require('@playwright/test');

function stripColorCodes (errorString) {
  const ansiRegex = /\x1b\[[0-9;]*m/g;
  return errorString.replace(ansiRegex, '');
}

const app = express();
app.use(bodyParser.json());

let browser
let context
let page

(async () => {
  browser = await chromium.connectOverCDP('http://localhost:9222');
  context = browser.contexts()[0];
  page = await context.pages()[0];
})();

const useCatch = async (fn, req, res) => {
  try {
    const reuslt = await fn(req, res);
    res.send('Success' + JSON.stringify(reuslt));
  } catch (error) {
    res.send('Error: ' + stripColorCodes(error.message));
  }
}

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.post('/test', (req, res) => useCatch(async (req, res) => {
  if (!req.body.code) {
    throw new Error('code is required');
  }
  const fn = new Function('return async ({context, page, expect}) =>{' + req.body.code + '}');
  return await fn()({ context, page, expect })
}, req, res));

app.listen(3110, () => {
  console.log('Example app listening on port 3110!');
})
