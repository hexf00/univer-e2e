# univer-e2e

Run with `--workers=1` to avoid performance impact caused by concurrency.

## How to install

```bash
pnpm install
```

## How to run

run with ui
```bash
E2E_SHEET_ENDPOINT=http://localhost:5173/ pnpm e2e --ui -g "Univer Sheet"
E2E_SHEET_ENDPOINT=http://localhost:5173/ pnpm e2e --ui -g "Univer Sheet"


E2E_SHEET_ENDPOINT=http://local.univer.plus:8081/pro-local-umd.html pnpm e2e --headed --ui 
E2E_SHEET_ENDPOINT=http://local.univer.plus:8080/ pnpm e2e --headed --ui 
```

run once
```bash
E2E_SHEET_ENDPOINT=http://localhost:5173/ pnpm e2e -g "Univer Sheet"
```

headed
```bash
E2E_SHEET_ENDPOINT=http://localhost:5173/ pnpm e2e --headed -g "Univer Sheet"
```

run with a regular filter, only run the test with the name contains 'raw load'
```bash
E2E_SHEET_ENDPOINT=http://localhost:5173/ pnpm e2e -g "Univer Sheet"
```

## Case

### sheet 

1. [x] 2 Collaborative editing with 2 clients
2. [ ] formula input
3. [x] Error log discovery
4. [x] tabs switch / tabs add
5. [x] random mouse move / wheel

### doc

1. [ ] base case 

## How to write a new test

```typescript
test(`new test`, async ({ page }) => {
  await page.goto('/');
  // wait for the page to be ready or to Pre work

  // The internal time of the step named 'timeCost' will only be counted
  await test.step('timeCost', async () => {
    // do something    
  })
});
```


## How to rec

```bash
node ./rec.js
```

## How to fastest debug
  
```bash
node ./server.js

curl --location 'localhost:3110/test' --header 'Content-Type: application/json' --data-raw '{"code":"page.goto(\"http://127.0.0.1:3110\")"}'
```
P.S you can use with Pre-request Script in Postman to send the

```js
// get body
var body = pm.request.body.raw;

// json encode
var jsonBody = JSON.stringify({code: body});

// update body
pm.request.body.update(jsonBody);
pm.request.headers.upsert({key: "Content-Type", value: "application/json"});
```

## How to debug on vscode

right click on the test file and click `Run Test` or `Debug Test`

need to install the `Playwright Test` extension on vscode

## How to dev

```
# only windows
taskkill /F /IM "msedge.exe"

"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --user-data-dir="D:\data\edge-test3" --profile-directory="user1" --remote-debugging-port=9222
# or
"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --user-data-dir="D:\data\edge-test3" --profile-directory="user1" --remote-debugging-port=9222 --headless
```

add env on vscode `D:\apps\VSCode-win32-x64-1.88.0\data\user-data\User\settings.json`
```
    "playwright.env": {
        "NODE_ENV": "development"
    }
```

```bash
NODE_ENV="development" pnpm e2e
```


## Troubleshooting

- Maybe you need check the `playwright.config.ts` file to see if the `projects` options are suitable for your environment.
- the timeout of the test is set to 10s, you can change it in the `playwright.config.ts` file.

## Reference

- [Writing Playwright tests](https://playwright.dev/docs/intro)