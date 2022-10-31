const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

copyDir();

async function copyDir(){
  fs.mkdir(path.join(__dirname, 'files-copy'), {recursive: true}, err => {
    if (err) throw err;
  });

  const files = await fsPromises.readdir(path.join(__dirname, 'files-copy'), err => {
    if (err) throw err;   
  });
  files.forEach(file => {
    fs.unlink(path.join(__dirname, 'files-copy', file), err => {
      if (err) throw err;
    });
  }); 

  const copyFiles = await fsPromises.readdir(path.join(__dirname, 'files'),(err, files) => {
    if (err) throw err;
  });
  copyFiles.forEach(file => {
    fs.copyFile(path.join(__dirname, 'files', file), path.join(__dirname, 'files-copy', file), err => {
      if (err) throw err});
  }); 
}