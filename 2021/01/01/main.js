import readline from 'readline';
import fs from 'fs';

console.log('Starting');

const input = '../input.txt';

var lineReader = readline.createInterface({
  input: fs.createReadStream(input)
});

console.log('Line Reader loaded');

let prev = null;
let count = 0;

lineReader.on('line', function (line) {
  const current = Number(line);

  if (prev && prev < current) {
    console.log(`${prev} is deeper than ${line}`)
    count++;
  }

  prev = current;
});

lineReader.on('close', function() {
  console.log(`It gets deeper ${count} times.`)
})
