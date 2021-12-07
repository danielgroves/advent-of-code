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
let current_board_template = {
  winner: false,
  data: []
}
let current_board = JSON.parse(JSON.stringify(current_board_template));

lineReader.on('line', function (line) {
  if (!bingo_numbers.length) {
    bingo_numbers = line.split(',');
    console.log('You bingo numbers are', bingo_numbers);
    return;
  }

  if (line === '' && current_board.data.length)  {
    score_boards.push(current_board);
    current_board = JSON.parse(JSON.stringify(current_board_template));
    return;
  }

  if (line !== '') {
    const row_numbers = line.split(' ').filter(x => x !== '');
    const row_obj = row_numbers.map((x) => { return { number: x, marked: false }});
    current_board.data.push(row_obj);
  }
});

lineReader.on('close', function() {
  // this fires after the last line of the file
  console.log('Your scoreboards are ready, heres an exmaple', JSON.stringify(score_boards[0], null, 2));

  // Populates when we find the winner
  let loosing_board;
  let loosing_number;

  bingo_numbers.map((current_number) => {
    // Pt. 1 -- Mark Matching Numbers


    // Loop over all the boards
    score_boards.map((current_board) => {
      if (current_board.winner || loosing_board) return;

      // Loop over all the rows
      current_board.data.map((current_row) => {
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
      if (current_board.winner || loosing_board) return;

      let column_index = new Array(complete_score);

      // Check for a complete row, meanwhile build a column list
      // Check for a complete column
      current_board.data.map((current_row) => {
        if (current_board.winner || loosing_board) return;

        const row_marked = current_row.filter(x => x.marked);
        if (row_marked.length === complete_score) {
          current_board.winner = true;

          if (isLastWinner(score_boards)) {
            loosing_board = current_board;
            loosing_number = current_number;
          }
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
        if (current_board.winner || loosing_board) return;

        const column_marked = current_column.filter(x => x.marked);
        if (column_marked.length === complete_score) {
          current_board.winner = true;

          if (isLastWinner(score_boards)) {
            loosing_board = current_board;
            loosing_number = current_number;
          }
        }
      });
    });
  })

  console.log('The losing board is', JSON.stringify(loosing_board, null, 2));
  // Find all unmarked numbers
  const unmarked_numbers = [];
  loosing_board.data.map((row) => {
    row.filter(x => !x.marked).map(num => unmarked_numbers.push(Number(num.number)));
  })

  // Sum them
  const sum = unmarked_numbers.reduce((prev, current) => prev + current, 0);

  // Multiply by final number
  console.log('Your score is', (sum * Number(loosing_number)))
});

function isLastWinner(boards) {
  const winningBoards = boards.filter(x => x.winner).length;
  const totalBoards = boards.length;
  console.log(`New winner! Previous winners: ${winningBoards}/${totalBoards}`)
  return winningBoards === (totalBoards)
}
