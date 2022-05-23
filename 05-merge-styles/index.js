const fs = require('fs');
const path = require('path');

const stylesFolder = path.join(__dirname, 'styles');
const projectFolder = path.join(__dirname, 'project-dist');

// create file
const pathToFile = path.join(projectFolder, 'bundle.css');
const output = fs.createWriteStream(pathToFile);

fs.readdir(stylesFolder, (err, files) => {
  let data = '';
  for (let file of files) {
    const folderFile = path.join(__dirname, 'styles', file);
    const stream = fs.createReadStream(folderFile, 'utf-8');

    fs.stat(folderFile, (err, stats) => {
      if (err) throw err;
      if (stats.isFile() && path.extname(file) === '.css') {
        stream.on('data', chunk => data += chunk);
        stream.on('end', () => output.write(data));
        stream.on('error', error => console.log('Error', error.message));
      }
    });
  }
});
