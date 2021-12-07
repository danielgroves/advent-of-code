import readline from 'readline';
import fs from 'fs';
import dataframe from 'dataframe-js';

console.log('Starting');

const input = '../input.txt';

var lineReader = readline.createInterface({
  input: fs.createReadStream(input)
});

console.log('Line Reader loaded');

let data_input = [];

lineReader.on('line', function (line) {
  const digits = line.split('');
  data_input.push(digits.map(Number));
});

lineReader.on('close', function() {
  // this fires after the last line of the file
  let oxygen_data = data_input;
  let co2_data = data_input;

  for (var i = 0; i < oxygen_data[0].length; i++) {
      let oxygen_counts = { '0': 0, '1': 0 };
      let co2_counts = { '0': 0, '1': 0 };

      for (let row of oxygen_data) {
        if (row[i] === 0) {
          oxygen_counts[0]++;
        } else {
            oxygen_counts[1]++;
        }
      }

      for (let row of co2_data) {
        if (row[i] === 0) {
          co2_counts['0']++;
        } else {
            co2_counts['1']++;
        }
      }

      let most_common;
      let least_common;

      if (oxygen_counts['0'] === oxygen_counts['1']) {
          most_common = 1;
      } else if (oxygen_counts['0'] > oxygen_counts['1']) {
          most_common = 0;
      } else if (oxygen_counts['1'] > oxygen_counts['0']) {
          most_common = 1;
      }

      if (co2_counts['0'] === co2_counts['1']) {
          least_common = 0;
      } else if (co2_counts['0'] > co2_counts['1']) {
          least_common = 1;
      } else if (co2_counts['1'] > co2_counts['0']) {
          least_common = 0;
      }

      if (oxygen_data.length !== 1) {
        oxygen_data = oxygen_data.filter((row) => row[i] === most_common);
      }

      if (co2_data.length !== 1) {
        co2_data = co2_data.filter(row => row[i] === least_common)
      }
  }

  const oxygen = parseInt(oxygen_data[0].join(''), 2);
  const co2 = parseInt(co2_data[0].join(''), 2);

  console.log(oxygen * co2);


});

