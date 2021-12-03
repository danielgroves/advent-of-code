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
  const columns = [...Array(12).keys()];

  const df = new dataframe.DataFrame(data_input, columns);
  const counts = [];

  for(var i of columns) {
    const res = df.groupBy(i).aggregate((group) => group.count()).toDict();
    const tmp_count = {};

    tmp_count[res[i][0]] = res.aggregation[0];
    tmp_count[res[i][1]] = res.aggregation[1];

    counts.push(tmp_count);
  }

  // at this point counts is a count of the commonality of each value in each col
  console.log(counts);

  const gamma_arr = [];
  const eps_arr = [];
  counts.map((x) => {
    if (x['0'] > x['1']) {
      gamma_arr.push(0);
      eps_arr.push(1);
      return;
    }

    gamma_arr.push(1);
    eps_arr.push(0);
  })

  const gamma = gamma_arr.join('');
  const epsilon = eps_arr.join('');
  const gamma_int = parseInt(gamma, 2);
  const epsilon_int = parseInt(epsilon, 2);

  console.log(`Power consumption is`, (gamma_int * epsilon_int));
});
