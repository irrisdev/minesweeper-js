document.addEventListener("DOMContentLoaded", () => {
  const width = 10;
  const height = 10;
  const mines = 30;
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

let initial = true;
const debug = false;
const bombSvg = `💣`

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

      if (debug){
        cellElement.innerHTML = b[y][x].mine ? `💣${b[y][x].adjacent}` : (b[y][x].adjacent == 0 ? " " : b[y][x].adjacent);
      }

      tablerow.append(cellElement);
    });
    m.append(tablerow);
  });
};

const revealCell = (b, x, y) => {
  x = Math.floor(x);
  y = Math.floor(y);

  if (x < 0 || x > b[0].length - 1 || y < 0 || y > b.length - 1 || b[y][x].revealed) {
    return;
  }

  let c = document.getElementById(y * b[0].length + x);

  c.innerHTML = b[y][x].mine ? bombSvg : b[y][x].adjacent == 0 ? " " : b[y][x].adjacent;
  c.classList.add("revealed");

  b[y][x].revealed = true;

  if (b[y][x].mine){
    return;
  }

  if (!b[y][x].adjacent == 0) {
    c.classList.add(`number-${b[y][x].adjacent}`);
    return;
  }

  offsets.forEach((offset) => {
    revealCell(b, x + offset[0], y + offset[1]);
  });
};

const checkNeighbors = (b, x, y) => {

  offsets.forEach((offset) => {
    let ox = x+offset[0]
    let oy = y+offset[1]

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

  cell.addEventListener("click", (e) => {
    let ty = Math.floor(e.target.parentNode.className);
    let tx = Math.floor(e.target.id % b[0].length);
    
    if (!b[ty][tx].revealed) {

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

        if (debug){
          checkNeighbors(b, tx, ty);

          board.forEach(function (ele, e) {
            ele.forEach(function (sq, i) {
              if (ele[i].mine) {
                // document.querySelector(
                //   `tr[class='${e}'] td:nth-child(${i + 1})`
                // ).style.backgroundColor = "red";
                document.querySelector(
                  `tr[class='${e}'] td:nth-child(${i + 1})`
                ).innerHTML = b[e][i].mine ? `💣${b[e][i].adjacent}` : b[e][i].adjacent == 0 ? " " : b[e][i].adjacent;

              }
            });
          });
        }
      }

      revealCell(b, tx, ty);
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
