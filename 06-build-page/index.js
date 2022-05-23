const fs = require('fs');
const path = require('path');

const stylesFolder = path.join(__dirname, 'styles');
const projectFolder = path.join(__dirname, 'project-dist');

// create Project-Dist folder
fs.mkdir(projectFolder, {recursive: true}, (err) => {
  if (err) throw err;
});

// create CSS file
const pathToFile = path.join(projectFolder, 'style.css');
const output = fs.createWriteStream(pathToFile);

// CSS compile
fs.readdir(stylesFolder, (err, files) => {
  if (err) throw err;
  for (let file of files) {
    let data = '';
    const folderFile = path.join(__dirname, 'styles', file);
    const stream = fs.createReadStream(folderFile, 'utf-8');

    fs.stat(folderFile, (err, stats) => {
      if (err) throw err;
      if (stats.isFile() && path.extname(file) === '.css') {
        stream.on('data', chunk => data += `${chunk}\n`);
        stream.on('end', () => output.write(data));
        stream.on('error', error => console.log('Error', error.message));
      }
    });
  }
});

// copy Assets
function copyDir(dirname) {

  let newFolderPath = path.join(projectFolder, dirname); // dist/assets
  if (dirname != 'assets') { newFolderPath = path.join(projectFolder, 'assets', dirname); }
  
  let originalFolderPath = path.join(__dirname, dirname); // assets
  if (dirname != 'assets') { originalFolderPath = path.join(__dirname, 'assets', dirname); }

  fs.mkdir(newFolderPath, {recursive: true}, (err) => {
    if (err) throw err;
  });

  fs.readdir(originalFolderPath, (err, files) => {
    for (let file of files) {
      if (err) throw err;
      let folderFile = path.join(originalFolderPath, file); // assets/folder/file.txt
      let newFolderPathFiles = path.join(newFolderPath, file); // dist/assets/folder/file.txt
      fs.stat(folderFile, (err, stats) => {
        if (err) throw err;
        if (stats.isDirectory()) {
          copyDir(file);
        }
        if (stats.isFile()) {
          fs.copyFile(folderFile, newFolderPathFiles, (err) => {
            if (err) throw err;
          });
        }
      });
    }
  });
}

copyDir('assets');

// Components HTML

const pathToNewHTML = path.join(projectFolder, 'index.html');
const pathToTemplateHTML = path.join(__dirname, 'template.html');
const pathToComponents = path.join(__dirname, 'components');

// copy html
fs.writeFile(pathToNewHTML, pathToTemplateHTML, (err) => {
  if (err) throw err;
});

// read html-template
const streamHTML = fs.createReadStream(pathToTemplateHTML, 'utf-8');

// read components and build page
let dataHTML = '';
streamHTML.on('data', chunk => { dataHTML += chunk; });

fs.readdir(pathToComponents, (err, files) => {
  if (err) throw err;
  for (let file of files) {
    let fileName = path.basename(file, '.html');
    let dataComponents = '';
    let streamComponent = fs.createReadStream(path.join(__dirname, 'components', `${fileName}.html`), 'utf-8');
    streamComponent.on('data', chunk => { dataComponents += chunk; });
    streamHTML.on('end', () => { 
      dataHTML = dataHTML.replace(`{{${fileName}}}`, dataComponents);
      fs.writeFile(pathToNewHTML, dataHTML, (err) => {
        if (err) throw err;
      });
    });
  }
});

streamHTML.on('error', error => console.log('Error', error.message));