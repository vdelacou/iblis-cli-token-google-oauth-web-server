iblis-cli-token-google-oauth-web-server
=============================

_**Cli to create access token for google sheets and google drive**_

[![Version](https://img.shields.io/npm/v/iblis-cli-token-google-oauth-web-server.svg)](https://npmjs.org/package/iblis-cli-token-google-oauth-web-server)
[![Downloads/week](https://img.shields.io/npm/dw/iblis-cli-token-google-oauth-web-server.svg)](https://npmjs.org/package/iblis-cli-token-google-oauth-web-server)
[![License](https://img.shields.io/npm/l/iblis-cli-token-google-oauth-web-server.svg)](https://github.com/vdelacou/iblis-cli-token-google-oauth-web-server/blob/master/package.json)

When you want to play with `Google Drive` or `Google Sheets` `API` with a simple `bash script` or in your `CI/CD pipeline`, you will need to have a `clientId`, a `clientSecret` and offline `access_token` and `refresh_token` linked to your google account. 

To do that you can follow this process:

https://developers.google.com/identity/protocols/oauth2/web-server

![Authorization process](https://developers.google.com/gsuite/marketplace/images/webserver_seq.png)

#### Or you can just use this cli to guide you and help you to follow this process step by step.

At the end, the cli will create a `.env` file with the Google `ClientId` / `ClientSecret` / `AccessToken` / `RefreshToken` 

***

# Usage

```sh-session
$ npm install -g iblis-cli-token-google-oauth-web-server
$ getGooToken
```

or 

```sh-session
$ npx iblis-cli-token-google-oauth-web-server getGooToken
```

