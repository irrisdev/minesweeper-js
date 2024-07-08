document.addEventListener("DOMContentLoaded", () => {
  const width = 10;
  const height = 10;
  const mines = 10;
  const minesweeper = document.getElementById("game");

  const board = generateBoard(width, height, mines);

  plotBoard(minesweeper, board);
});

const generateBoard = (x, y, mines) => {
  board = Array.from({ length: y }, () =>
    Array.from({ length: x }, () => ({
      mine: false,
      revealed: false,
      flagged: false,
      adjacent: 0,
    }))
  );

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

  return board;
};

const plotBoard = (m, b) => {
  b.forEach((row, y) => {
    tablerow = document.createElement("tr");
    row.forEach((cell, x) => {
      cellElement = createCell(x, y);
      tablerow.append(cellElement);
    });
    m.append(tablerow);
  });
};

const createCell = (x, y) => {
  cell = document.createElement("td");

  return cell;
};
