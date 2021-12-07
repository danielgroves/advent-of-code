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

  let x_range;
  let y_range;

  if (start_coord[0] > end_coord[0]) {
    const cache = end_coord[0];
    end_coord[0] = start_coord[0];
    start_coord[0] = cache;
  }

  if (start_coord[1] > end_coord[1]) {
    const cache = end_coord[1];
    end_coord[1] = start_coord[1];
    start_coord[1] = cache;
  }

  if (start_coord[0] === end_coord[0]) {
    // X doesn't change, calc y
    x_range = [ start_coord[0] ];
    const y_count = (end_coord[1] - start_coord[1]) + 1;
    y_range = Array(y_count).fill().map((_, i) => i + start_coord[1])
  } else if (start_coord[1] === end_coord[1]) {
    // y doesnt change, calc x

    y_range = [ start_coord[1] ];
    const x_count = (end_coord[0] - start_coord[0]) + 1;
    x_range = Array(x_count).fill().map((_, i) => i + start_coord[0])
  }

  if (!x_range || !y_range) return;

  x_range.map((x_coord) => {
    y_range.map((y_coord) => {
      const vent_entry = vents.find((e) => e.x === x_coord &&  e.y === y_coord);

      if (vent_entry) {
        vent_entry.count++;
        return;
      }

      vents.push({
        x: x_coord,
        y: y_coord,
        count: 1
      });
    })
  })
});

lineReader.on('close', function() {
  console.log(vents);

  const multiple = vents.filter((x) => x.count > 1);
  console.log(multiple.length);
});

