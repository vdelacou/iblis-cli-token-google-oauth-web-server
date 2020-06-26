import {Command} from '@oclif/command'
import cli from 'cli-ux'
import {OAuth2Client} from 'googleapis-common'
import * as express from 'express'
import {writeFileSync} from 'fs-extra'

const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive',
]
const redirectUrl = 'http://localhost:3888'

/**
 * Get an authorize url from a client id and client secret
 * @param {string} clientId the client id
 * @param {string} clientSecret the client secret
 * @returns {string} the authorize url
 */
const getAuthorizeUrl = async (clientId: string, clientSecret: string) => {
  const oAuth2Client = new OAuth2Client(clientId, clientSecret, redirectUrl)
  const authorizeUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES.join(' '),
  })

  return authorizeUrl
}

/**
 * Get the authentication tokens from code after authentication
 * @param {string} clientId the client id
 * @param {string} clientSecret the client secret
 * @param {string} code the code received after authentication
 * @returns {Credentials} the tokens (acess, refresh, ect ...)
 */
const getToken = async (
  clientId: string,
  clientSecret: string,
  code: string
) => {
  const oAuth2Client = new OAuth2Client(clientId, clientSecret, redirectUrl)
  const {tokens} = await oAuth2Client.getToken(code)
  return tokens
}

/**
 * Create a local server on port 3888 to received the code on redirect url after the authentication
 * @param {string} clientId the client id
 * @param {string} clientSecret the client secret
 */
const createLocalServer = async (clientId: string, clientSecret: string) => {
  const app = express()
  const port = 3888

  const server = app.listen(port)
  app.get('/', async (req, res) => {
    try {
      const token = await getToken(
        clientId,
        clientSecret,
        req.query.code as string
      )
      writeFileSync(
        '.env',
        `
# Google Credentials
GOOGLE_CLIENT_ID=${clientId}
GOOGLE_CLIENT_SECRET=${clientSecret}
GOOGLE_ACCESS_TOKEN=${token.access_token}
GOOGLE_REFRESH_TOKEN=${token.refresh_token}
       `
      )
      res.send('File .env generated at your root folder')
      server.close()
    } catch (error) {
      const errorMessage = error.message ? {error: error.message} : error
      res.send(
        `Error during token generation: ${JSON.stringify(errorMessage)}`
      )
    }
  })
}

/**
 * The main class to launch the cli
 */
class IblisCliSetupGoogleClient extends Command {
  static description = 'describe the command here';

  async run() {
    // Create the project
    this.log(
      '\n \n----------------------------------- \n \n' +
        'To create a new Google project go to : \n' +
        '\nhttps://console.developers.google.com/projectcreate \n'
    )

    const isProjectCreated = await cli.confirm('Is the project created? (y/n)')
    if (isProjectCreated === false) {
      return
    }

    // Enable google drive api
    this.log(
      '\n \n----------------------------------- \n \n' +
        'To Enable Google Drive API go to : \n' +
        '\nhttps://console.developers.google.com/apis/library/drive.googleapis.com \n'
    )

    const isGoogleDriveApiEnabled = await cli.confirm(
      'Is the Google Drive API enabled? (y/n)'
    )
    if (isGoogleDriveApiEnabled === false) {
      return
    }

    // Enable google sheets api
    this.log(
      '\n \n----------------------------------- \n \n' +
        'To Enable Google Sheets API go to : \n' +
        '\nhttps://console.developers.google.com/apis/library/sheets.googleapis.com \n'
    )

    const isGoogleSheetApiEnabled = await cli.confirm(
      'Is the Google Sheets API enabled? (y/n)'
    )
    if (isGoogleSheetApiEnabled === false) {
      return
    }

    // Create consent screen
    this.log(
      '\n \n----------------------------------- \n \n' +
        'To Create a Consent Screen go to : \n' +
        '\nhttps://console.developers.google.com/apis/credentials/consent \n \n' +
        'Choose Create (internal or external), then only the `Application name` is mandatory \n'
    )

    const isConsentScreenCreated = await cli.confirm(
      'Is the Consent Screen created? (y/n)'
    )
    if (isConsentScreenCreated === false) {
      return
    }

    // Create Oauth client
    this.log(
      '\n \n----------------------------------- \n \n' +
        'To Create a Oauth Client go to : \n' +
        '\nhttps://console.developers.google.com/apis/credentials/oauthclient \n \n' +
        'Choose: \n' +
        '- Application type : Web application \n' +
        `- Authorized redirect URIs : ${redirectUrl} \n`
    )

    const isClientOauthCreated = await cli.confirm(
      'Is the Oauth Client created? (y/n)'
    )
    if (isClientOauthCreated === false) {
      return
    }

    const clientId = await cli.prompt('\n What is your clientId?', {
      required: true,
    })
    const clientSecret = await cli.prompt('\n What is your clientSecret?', {
      required: true,
    })

    const authorizeUl = await getAuthorizeUrl(clientId, clientSecret)
    this.log(
      '\n \n----------------------------------- \n \n' +
        'Please go to the following url and log with your google account : \n' +
        'Choose advanced settings and access to app if your app is not validated \n' +
        `\n${authorizeUl} \n \n`
    )

    // we launch local server to get the code back on redirect url
    await createLocalServer(clientId, clientSecret)
  }
}

export = IblisCliSetupGoogleClient;
