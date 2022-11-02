const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');
const pipeline = require('stream');


create(path.join(__dirname, 'project-dist', 'assets'));

async function create(folder){
  createFolder();
  await fsPromises.rm(folder, { recursive: true, force: true }, err => {
    if (err) throw err;
    console.log('delete');
  });
  copyDir(path.join(__dirname, 'assets'), folder);
  connectStyles();
  copyTemplate();
}

async function createFolder(){
  await fsPromises.mkdir(path.join(__dirname, 'project-dist', 'assets'), {recursive: true}, err => {
    if (err) throw err;
  });
}

async function connectStyles(){
  const output = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'));
  const files = await fsPromises.readdir(path.join(__dirname, 'styles'), err => {
    if (err) throw err;   
  });

  files.forEach(file => {
    const dir = path.join(__dirname, 'styles', file);
    const extname = path.extname(dir);
    if (extname === ".css"){
      const stream = fs.createReadStream(path.join(dir));
      stream.on('data', data => output.write(data.toString() + '\n'));
    }
  }); 
}

async function copyDir(folder, way) {
  fs.mkdir(way, {recursive: true}, err => {
    if (err) throw err;
  });
  const files = await fsPromises.readdir(folder, {withFileTypes: true}, err => {
    if (err) throw err;   
  });
  files.forEach(file => {
    if (file.isDirectory()){
      const dir = path.join(folder, file.name);
      copyDir(dir, path.join(way, file.name));
    }
    if (file.isFile()){
      fs.copyFile(path.join(folder, file.name), path.join(way, file.name), err =>{
        if (err) throw err;
      })
    }
  });
}

async function copyTemplate(){
  const files = await fsPromises.readdir(path.join(__dirname, 'components'), {withFileTypes: true}, err => {
    if (err) throw err;   
  });
  const output = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'))
  const stream = fs.createReadStream(path.join(__dirname, 'template.html'));
  let str;
  let htmlArr = [];
  let names = [];
  files.forEach(async file => {
    const dir = path.join(__dirname, 'components', file.name);
    const extname = path.extname(dir);
    if (extname === '.html'){
      let name = file.name;
      name = name.slice(0, name.length - extname.length);
      const htmlStream = fs.createReadStream(dir);
      for await (const chunk of htmlStream){
        names.push(name);
        htmlArr.push(chunk.toString());
      };
    }
  });
  for await (const chunk of stream){
    str = chunk.toString();
  }
  for (let i = 0; i < htmlArr.length; i++){
    if (str.indexOf(`{{${names[i]}}}`)){
      str = str.replace(`{{${names[i]}}}`, htmlArr[i])
    }
  }
}