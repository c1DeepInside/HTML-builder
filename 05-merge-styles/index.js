const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');
const output = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));
connectStyles();

async function connectStyles(){
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