const path = require('path');
const  fsPromises = require('fs/promises');
fsPromises.readdir(path.join(__dirname, 'secret-folder'), {withFileTypes: true}).then(files => {
  for (let i = 0; i < files.length; i++){
    if (files[i].isFile()){
      const dir = path.join(__dirname, 'secret-folder', files[i].name);
      const name = path.basename(dir).split('.');
      fsPromises.stat(dir).then(file => {
        console.log(name[0] + ' - ' + name[1] + ' - ' + file.size + 'b');
      });
    }
  }
});
