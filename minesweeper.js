document.addEventListener("DOMContentLoaded", () => {
  const width = 10;
  const height = 14;
  const mines = 10;
  const minesweeper = document.getElementById("game");

  const board = generateBoard(width, height, mines);

  plotBoard(minesweeper, board);
});

const offsets = [
  [-1, -1],
  [0, -1],
  [1, -1],
  [-1, 0],
  [1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
];

const modifyNeighbors = (b, x, y, value) => {
  let ox, oy;
  offsets.forEach((offset) => {

    ox = x + offset[0];
    oy = y + offset[1];

    if ((ox < 0 || ox > (b[0].length -1)) || (oy < 0 || oy > (b.length-1)) || b[oy][ox].mine) {
      return;
    }

    b[oy][ox].adjacent += value;

  });

};

const generateBoard = (x, y, mines) => {

  let rx, ry, placed = 0;

  board = Array.from({ length: y }, () =>
    Array.from({ length: x }, () => ({
      mine: false,
      revealed: false,
      flagged: false,
      adjacent: 0,
    }))
  );

  while (placed < mines) {

    rx = Math.floor(Math.random() * x);
    ry = Math.floor(Math.random() * y);

    while (board[ry][rx].mine) {
      rx = Math.floor(Math.random() * x);
      ry = Math.floor(Math.random() * y);
    }

    board[ry][rx].mine = true;

    modifyNeighbors(board, rx, ry, 1);

    placed++;

  }

  return board;
};

const plotBoard = (m, b) => {
  b.forEach((row, y) => {
    tablerow = document.createElement("tr");
    tablerow.classList.add(y);
    row.forEach((cell, x) => {
      cellElement = createCell(b, x, y);
      cellElement.id = (y*b[0].length + x);
      //cellElement.innerHTML = b[y][x].mine ? "💣" : (b[y][x].adjacent == 0 ? " " : b[y][x].adjacent);
      tablerow.append(cellElement);
    });
    m.append(tablerow);
  });
};

const revealCell = (b, x, y) => {
  x = Math.floor(x);
  y = Math.floor(y);
  //console.log(x,y,y*b[0].length + x);

  if (x < 0 || x > b[0].length-1 || y < 0 || y > b.length-1 || b[y][x].mine || b[y][x].revealed) { return; }

  let c = document.getElementById(y*b[0].length + x);

  if (!b[y][x].adjacent == 0) {
    
    c.innerHTML = b[y][x].mine ? "💣" : (b[y][x].adjacent == 0 ? " " : b[y][x].adjacent);
    c.classList.add("revealed");
    b[y][x].revealed = true;

    return;
  }

  c.innerHTML = b[y][x].mine ? "💣" : (b[y][x].adjacent == 0 ? " " : b[y][x].adjacent);
  c.classList.add("revealed");
  b[y][x].revealed = true;

  offsets.forEach((offset) => {

    revealCell(b, x + offset[0], y + offset[1]);

  });




}

const createCell = (b) => {
  let ty, tx, cell = document.createElement("td");
  cell.addEventListener("click", (e) => {
    ty = e.target.parentNode.className;
    tx = e.target.id % b[0].length;
    console.log(tx,ty);
    if (!b[ty][tx].revealed){
      revealCell(b, tx, ty);
    }

  });
  return cell;
};
