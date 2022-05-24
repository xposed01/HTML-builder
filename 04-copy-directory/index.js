function copyDir() {
  
  const fs = require('fs');
  const path = require('path');
  const newFolderPath = path.join(__dirname, 'files-copy');
  const copyFolderPath = path.join(__dirname, 'files');

 
  fs.access(newFolderPath, error => {
    if (!error) {
      fs.rm(newFolderPath, {recursive: true,force: true,}, (err) => {
        if (err) throw err;
        generatorDir();
      }); 
    } else {
      generatorDir();
    }
  });

  function generatorDir() {
    fs.mkdir(newFolderPath, {recursive: true}, (err) => {
      if (err) throw err;
    });

    fs.readdir(copyFolderPath, (err, files) => {
      for (let file of files) {
        if (err) throw err;
        let folderFile = path.join(__dirname, 'files', file);
        let newFolderPathFiles = path.join(__dirname, 'files-copy', file);
        fs.copyFile(folderFile, newFolderPathFiles, (err) => {
          if (err) throw err;
        });
      }
      console.log('Files copied to new folder');
    });
  }

}
  
copyDir();