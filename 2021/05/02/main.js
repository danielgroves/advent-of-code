import readline from 'readline';
import fs from 'fs';

console.log('Starting');

const input = '../input.txt';

var lineReader = readline.createInterface({
  input: fs.createReadStream(input)
});

console.log('Line Reader loaded');

const vents = [];

lineReader.on('line', function (line) {
  const coords = line.split(' -> ');

  const start_coord = coords[0].split(',').map(Number);
  const end_coord = coords[1].split(',').map(Number);

  let x_nums = calcRange(start_coord[0], end_coord[0]);
  let y_nums = calcRange(start_coord[1], end_coord[1]);

  let ranges = evenRanges(x_nums, y_nums);

  for (let index = 0; index < ranges.x.length; index++) {
    let x_coord = ranges.x[index];
    let y_coord = ranges.y[index];

    const vent_entry = vents.find((e) => e.x === x_coord &&  e.y === y_coord);

    if (vent_entry) {
      vent_entry.count++;
      continue;
    }

    vents.push({
      x: x_coord,
      y: y_coord,
      count: 1
    });
  }
});

function calcRange(start, end) {
  if (start > end) {
    const range_size = (start - end) + 1;
    return Array(range_size).fill().map((_, i) => start - i)
  }

  const range_size = (end - start) + 1;
  return Array(range_size).fill().map((_, i) => start + i)
}

function evenRanges(x, y) {
  const x_length = x.length;
  const y_length = y.length;

  if (x_length < y_length) {
    x = Array(y_length).fill().map((_, i) => x[0])
  }

  if (y_length < x_length) {
    y = Array(x_length).fill().map((_, i) => y[0])
  }

  return { x, y }
}

lineReader.on('close', function() {
  console.log(vents);

  const multiple = vents.filter((x) => x.count > 1);
  console.log(multiple.length);
});

