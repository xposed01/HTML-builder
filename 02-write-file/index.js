const { stdin, stdout } = process;
const fs = require('fs');
const path = require('path');

// create file
const pathToFile = path.join(__dirname, 'text.txt');
const output = fs.createWriteStream(pathToFile);

stdout.write('whats your name?\n');

stdin.on('data', data => {
  let dataString = data.toString().trim();
  if (dataString == 'exit') {
    process.exit();
  } else {
    stdout.write(`'${dataString}' add to text.txt\n`);
    output.write(data);
  }
});

// exit
process.on('SIGINT', () => process.exit());
process.on('exit', () => stdout.write('End of Program, Bye!'));