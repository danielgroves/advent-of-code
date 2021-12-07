import readline from 'readline';
import fs from 'fs';

console.log('Starting');

const input = '../input.txt';

var lineReader = readline.createInterface({
  input: fs.createReadStream(input)
});

console.log('Line Reader loaded');

let bingo_numbers = [];
let score_boards = [];
let current_board = []

lineReader.on('line', function (line) {
  if (!bingo_numbers.length) {
    bingo_numbers = line.split(',');
    console.log('You bingo numbers are', bingo_numbers);
    return;
  }

  if (line === '' && current_board.length)  {
    score_boards.push(current_board);
    current_board = [];
    return;
  }

  if (line !== '') {
    const row_numbers = line.split(' ').filter(x => x !== '');
    const row_obj = row_numbers.map((x) => { return { number: x, marked: false }});
    current_board.push(row_obj);
  }
});

lineReader.on('close', function() {
  // this fires after the last line of the file
  console.log('Your scoreboards are ready');

  // Populates when we find the winner
  let winning_board;
  let winning_number;

  bingo_numbers.map((current_number) => {
    // Pt. 1 -- Mark Matching Numbers
    if (winning_board) return;

    // Loop over all the boards
    score_boards.map((current_board) => {
      // Loop over all the rows
      current_board.map((current_row) => {
        // Find  any matching numbers, and now mark them
        const matching_numbers = current_row.filter(x => x.number === current_number);
        matching_numbers.map((matching_number) => matching_number.marked = true);
      })
    })

    // Pt. 2 -- Check for winning boards
    // We need to check for complete rows here, and complete columns.
    // Loop over the boards
    const complete_score = 5;
    score_boards.map((current_board) => {
      if (winning_board) return;

      let column_index = new Array(complete_score);

      // Check for a complete row, meanwhile build a column list
      // Check for a complete column
      current_board.map((current_row) => {
        if (winning_board) return;

        const row_marked = current_row.filter(x => x.marked);
        if (row_marked.length === complete_score) {
          winning_board = current_board;
          winning_number = current_number;
          return;
        }

        // Loop over the columns to build a column index
        current_row.map((row_column, index) => {
          if (!column_index[index]) {
            column_index[index] = [];
          }

          column_index[index].push(row_column);
        })
      });

      column_index.map((current_column) => {
        if (winning_board) return;

        const column_marked = current_column.filter(x => x.marked);
        if (column_marked.length === complete_score) {
          winning_board = current_board;
          winning_number = current_number;
          return;
        }
      });
    });
  })

  console.log('The winning board is', winning_board);
  // Find all unmarked numbers
  const unmarked_numbers = [];
  winning_board.map((row) => {
    row.filter(x => !x.marked).map(num => unmarked_numbers.push(Number(num.number)));
  })

  // Sum them
  const sum = unmarked_numbers.reduce((prev, current) => prev + current, 0);

  // Multiply by final number
  console.log('Your score is', (sum * winning_number));
});

