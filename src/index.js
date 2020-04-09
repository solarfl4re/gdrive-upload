const fs = require('fs');
const path = require('path');
const client = require('./client')
const {google} = require('googleapis');

function upload(fileName) {
  const auth = client.oAuth2Client;
  const name = path.basename(fileName);
  const drive = google.drive({version: 'v3', auth});
  var fileMetadata = {
    'name': name
  };
  var media = {
    body: fs.createReadStream(fileName)
  };
  drive.files.create({
    resource: fileMetadata,
    media: media,
    fields: 'id'
  }, (err, file) => {
    if (err) {
      console.error(err);
    } else {
      console.log('File ID: ', file.id);
    }
  });
};

module.exports = upload;
