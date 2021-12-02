import readline from 'readline';
import fs from 'fs';

console.log('Starting');

const input = '../input.txt';

var lineReader = readline.createInterface({
  input: fs.createReadStream(input)
});

console.log('Line Reader loaded');

let depth = 0;
let horizontal = 0;
let aim = 0;

lineReader.on('line', function (line) {
  const components = line.split(' ');
  const keyword = components[0];
  const movement = Number(components[1]);

  switch (keyword)
  {
    case 'up':
      aim -= movement
      break;
    case 'down':
      aim += movement
      break;
    case 'forward':
      horizontal += movement
      depth += (aim * movement);
      break;
    default:
      console.error('You missed a keyword', keyword)
  }

  console.log('Movement adjustment made', { depth, horizontal, aim })
});

lineReader.on('close', function() {
  // this fires after the last line of the file
  console.log('Final score is', (depth * horizontal));
})
