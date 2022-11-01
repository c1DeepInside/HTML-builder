const path = require('path');
const  fsPromises = require('fs/promises');
fsPromises.readdir(path.join(__dirname, 'secret-folder'), {withFileTypes: true}).then(files => {
  for (let i = 0; i < files.length; i++){
    if (files[i].isFile()){
      const dir = path.join(__dirname, 'secret-folder', files[i].name);
      const name = path.basename(dir);
      const extname = path.extname(dir);
      fsPromises.stat(dir).then(file => {
        console.log(name.slice(0, name.length - extname.length) + ' - ' + extname.slice(1) + ' - ' + file.size + 'b');
      });
    }
  }
});
