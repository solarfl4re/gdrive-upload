# gdrive-upload
Exports an 'upload' function to upload a file to Google Drive (Using to backup Ghost website).
Based on Google's Quickstart for the NodeJS Google Drive API.

## Examples
- Upload an archive of my website (`NodeJS`):
  ````js
  const upload = require('gdrive-upload');
  
  upload("/home/david/backups/backup-09-04-2020.zip")
  ````
