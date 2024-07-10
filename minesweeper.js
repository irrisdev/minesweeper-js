document.addEventListener("DOMContentLoaded", () => {
  const minesweeper = document.getElementById("minesweeper");

  const board = generateBoard(width, height, mines);

  plotBoard(minesweeper, board);

  minesweeper.classList.remove("hidden");
});

const Modes = Object.freeze({
  EASY: {
    width: 10,
    height: 8,
    mines: 10,
  },

  NORMAL: {
    width: 18,
    height: 14,
    mines: 40,
  },

  HARD: {
    width: 24,
    height: 20,
    mines: 99,
  },
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

const width = 10;
const height = 10;
const mines = 30;

const debug = false;
const bombSvg = `💣`;

let initial = true;
let revealed = 0;

const modifyNeighbors = (b, x, y, value) => {
  offsets.forEach((offset) => {
    let ox = x + offset[0];
    let oy = y + offset[1];

    if (ox < 0 || ox > b[0].length - 1 || oy < 0 || oy > b.length - 1) {
      return;
    }

    b[oy][ox].adjacent += value;
  });
};

const generateBoard = (x, y, mines) => {
  let placed = 0;

  board = Array.from({ length: y }, () =>
    Array.from({ length: x }, () => ({
      mine: false,
      revealed: false,
      flagged: false,
      adjacent: 0,
    }))
  );

  while (placed < mines) {
    placeMine(board);

    placed++;
  }

  return board;
};

const placeMine = (b, exclude) => {
  let x = b[0].length;
  let y = b.length;

  let rx = Math.floor(Math.random() * x);
  let ry = Math.floor(Math.random() * y);

  if (typeof exclude === "undefined") {
    exclude = new Set();
  }

  while (b[ry][rx].mine || exclude.has(`${rx},${ry}`)) {
    rx = Math.floor(Math.random() * x);
    ry = Math.floor(Math.random() * y);
  }

  b[ry][rx].mine = true;

  modifyNeighbors(board, rx, ry, 1);

  return [rx, ry];
};

const plotBoard = (m, b) => {
  b.forEach((row, y) => {
    tablerow = document.createElement("tr");
    tablerow.classList.add(y);

    row.forEach((cell, x) => {
      cellElement = createCell(b, x, y);
      cellElement.id = y * b[0].length + x;
      if (debug) {
        cellElement.innerHTML = b[y][x].mine ? `💣${b[y][x].adjacent}` : b[y][x].adjacent == 0 ? " " : b[y][x].adjacent;
      }

      tablerow.append(cellElement);
    });
    m.append(tablerow);
  });
};

const gameEnd = (win) => {
  if (win) {
  } else {
  }
};

const revealCell = (b, x, y) => {
  x = Math.floor(x);
  y = Math.floor(y);

  if (x < 0 || x > b[0].length - 1 || y < 0 || y > b.length - 1 || b[y][x].revealed) {
    return;
  }

  let c = document.getElementById(y * b[0].length + x);

  c.innerHTML = b[y][x].mine ? bombSvg : b[y][x].adjacent == 0 ? " " : `<p>${b[y][x].adjacent}</p>`;
  c.classList.replace("bg-zinc-100", "bg-zinc-200");

  b[y][x].revealed = true;

  if (b[y][x].mine) {
    gameEnd(false);
    return;
  }

  if (!b[y][x].adjacent == 0) {
    c.classList.add(`number-${b[y][x].adjacent}`);
    return;
  }

  revealed++;

  if (revealed == width * height) {
    gameEnd(true);
  }

  offsets.forEach((offset) => {
    revealCell(b, x + offset[0], y + offset[1]);
  });
};

const checkNeighbors = (b, x, y) => {
  offsets.forEach((offset) => {
    let ox = x + offset[0];
    let oy = y + offset[1];

    if (ox < 0 || ox > b[0].length - 1 || oy < 0 || oy > b.length - 1) {
      return;
    }

    if (b[oy][ox].mine) {
      console.log("Push Away Failed");
    } else {
      console.log("Push Away Sucess");
    }
  });
};

const createCell = (b) => {
  let cell = document.createElement("td");

  cell.classList.add("bg-zinc-100", "hover:bg-zinc-200", "font-medium", "text-xl");

  cell.addEventListener("click", (e) => {
    let ty = Math.floor(e.target.parentNode.className[0]);
    let tx = Math.floor(e.target.id % b[0].length);

    if (e.target.nodeName.toLowerCase() === "p" || b[ty][tx].flagged || b[ty][tx].revealed) return;

    if (initial) {
      const excludePositions = new Set();
      const localoffsets = [...offsets];
      localoffsets.push([0, 0]);
      localoffsets.forEach((ele) => {
        excludePositions.add(`${tx + ele[0]},${ty + ele[1]}`);
      });

      localoffsets.forEach((offset) => {
        let ox = tx + offset[0];
        let oy = ty + offset[1];

        if (ox < 0 || ox > b[0].length - 1 || oy < 0 || oy > b.length - 1 || !b[oy][ox].mine) {
          return;
        }

        b[oy][ox].mine = false;
        modifyNeighbors(b, ox, oy, -1);
        placeMine(b, excludePositions);
      });

      initial = false;

      if (debug) {
        checkNeighbors(b, tx, ty);

        board.forEach(function (ele, e) {
          ele.forEach(function (sq, i) {
            if (ele[i].mine) {
              // document.querySelector(
              //   `tr[class='${e}'] td:nth-child(${i + 1})`
              // ).style.backgroundColor = "red";
              document.querySelector(`div[class='${e}'] div:nth-child(${i + 1})`).innerHTML = b[e][i].mine
                ? `💣${b[e][i].adjacent}`
                : b[e][i].adjacent == 0
                ? " "
                : b[e][i].adjacent;
            }
          });
        });
      }
    }

    revealCell(b, tx, ty);
  });

  cell.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    let ty = Math.floor(event.target.parentNode.className[0]);
    let tx = Math.floor(event.target.id % b[0].length);

    if (event.target.nodeName.toLowerCase() === "p" || b[ty][tx].revealed) return;

    let r = document.getElementById(ty * b[0].length + tx);

    if (b[ty][tx].flagged) {
      b[ty][tx].flagged = false;
      r.innerHTML = "";
    } else {
      b[ty][tx].flagged = true;
      r.innerHTML = `🚩`;
    }
  });

  return cell;
};

//Cheat - Credit: github.com/sauce-2 - kinda mid
// board.forEach(function (ele, e) {
//   ele.forEach(function (sq, i) {
//     if (ele[i].mine) {
//       console.log(e, i);
//       document.querySelector(
//         `tr[class='${e}'] td:nth-child(${i + 1})`
//       ).style.backgroundColor = "red";
//     }
//   });
// });
