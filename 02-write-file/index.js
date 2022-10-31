const fs = require('fs');
const path = require('path');
const { stdin, exit} = process;
const output = fs.createWriteStream(path.join(__dirname,'text.txt'));
console.log('Hello! Enter the text.');
stdin.on('data', data => {
  if (data.toString().trim() === 'exit'){
    end();
  }
  output.write(data);
})
process.on('SIGINT', end);

function end() {
  console.log('Goodbye!');
  exit();
}