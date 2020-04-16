const fs = require('fs');
const path = require('path');
const readline = require('readline');
const {google} = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

class gClient {
  constructor() {
    // Load client secrets from a local file.
    const credentials = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'credentials.json'), 'utf-8'));
    // Authorize a client with credentials, then call the Google Drive API.

    const {client_secret, client_id, redirect_uris} = credentials.installed;
    this.oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    try {
      var tokens = fs.readFileSync(path.resolve(__dirname, TOKEN_PATH), 'utf-8');
    } catch {
      return this.getAccessToken(this.oAuth2Client);
    }
      this.oAuth2Client.setCredentials(JSON.parse(tokens));
  }

  /**
   * Get and store new token after prompting for user authorization, and then
   * execute the given callback with the authorized OAuth2 client.
   * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
   * @param {getEventsCallback} callback The callback for the authorized client.
   */
  getAccessToken() {
    const authUrl = this.oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
      rl.close();
      this.oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error retrieving access token', err);
        this.oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFile(path.resolve(__dirname, TOKEN_PATH), JSON.stringify(token), (err) => {
          if (err) return console.error(err);
          console.log('Token stored to', TOKEN_PATH);
        });
      });
    });
  }
}

module.exports = new gClient()

if (require.main === module) {
  /**
   * Lists the names and IDs of up to 10 files.
   * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
   */
  auth = new gClient().oAuth2Client;
  const drive = google.drive({version: 'v3', auth});
  drive.files.list({
    pageSize: 10,
    fields: 'nextPageToken, files(id, name)',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const files = res.data.files;
    if (files.length) {
      console.log('Files:');
      files.map((file) => {
        console.log(`${file.name} (${file.id})`);
      });
    } else {
      console.log('No files found.');
    }
  });
}
