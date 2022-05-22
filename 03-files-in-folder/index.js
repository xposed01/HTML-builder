const fs = require('fs');
const path = require('path');

const secretFolderPath = path.join(__dirname, 'secret-folder');

fs.readdir(secretFolderPath, (err, files) => {
  for (let file of files) {
    let folderFile = path.join(__dirname, 'secret-folder', file);
    fs.stat(folderFile, (err, stats) => {
      if (err) throw err;
      if (stats.isFile()) {
        console.log(`${path.parse(file).name} - ${path.extname(file).slice(1)} - ${stats.size / 1000} kb`);
      }
    });
  }
});