import readline from 'readline';
import fs from 'fs';

console.log('Starting');

const input = '../input.txt';

var lineReader = readline.createInterface({
  input: fs.createReadStream(input)
});

console.log('Line Reader loaded');

let prev = [];
let prev_sum = null;
let count = 0;

lineReader.on('line', function (line) {
  const current_int = Number(line);

  const prev_length = prev.push(current_int);

  // ensures we only ever have four measurements in the array
  if (prev_length > 3) {
    prev.shift();
  }

  // dont start adding until we have enough data
  if (prev_length < 3) {
    console.warn('array not big enough, skipping', prev);
    return;
  }

  const current_sum = prev.reduce((a, b) => a + b, 0)
  console.log(`these numbers total ${prev_sum}`, prev);

  if (prev_sum && current_sum > prev_sum) {
    console.log(`${current_sum} > ${prev_sum}`);
    count++;
  }

  prev_sum = current_sum;
});

lineReader.on('close', function() {
  // this fires after the last line of the file
  console.log(`It gets deeper ${count} times.`)
})
