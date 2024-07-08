document.addEventListener("DOMContentLoaded", () => {
  const width = 10;
  const height = 10;
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
      cellElement.classList.add(x);
      tablerow.append(cellElement);
    });
    m.append(tablerow);
  });
};

const revealCell = (b, c, x, y) => {

  c.innerHTML = b[y][x].mine ? "💣" : b[y][x].adjacent;

}

const createCell = (b) => {
  let ty, tx, cell = document.createElement("td");
  cell.addEventListener("click", (e) => {
    ty = e.target.parentNode.className
    tx = e.target.className

    revealCell(b, cell, tx, ty);


  });
  return cell;
};
