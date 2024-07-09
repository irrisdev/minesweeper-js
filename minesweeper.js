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

let initial = true;

const modifyNeighbors = (b, x, y, value) => {
  let ox, oy;
  offsets.forEach((offset) => {
    ox = x + offset[0];
    oy = y + offset[1];

    if (
      ox < 0 ||
      ox > b[0].length - 1 ||
      oy < 0 ||
      oy > b.length - 1 ||
      b[oy][ox].mine
    ) {
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
    let [rx, ry] = placeMine(board);

    modifyNeighbors(board, rx, ry, 1);

    placed++;
  }

  return board;
};

const placeMine = (b, exclude) => {
  let rx,
    ry,
    x = b[0].length,
    y = b.length;

  rx = Math.floor(Math.random() * x);
  ry = Math.floor(Math.random() * y);

  if (typeof exclude === "undefined") {
    exclude = new Set();
  }

  while (b[ry][rx].mine || exclude.has(`${rx},${ry}`)) {
    rx = Math.floor(Math.random() * x);
    ry = Math.floor(Math.random() * y);
  }

  b[ry][rx].mine = true;

  return [rx, ry];
};

const plotBoard = (m, b) => {
  b.forEach((row, y) => {
    tablerow = document.createElement("tr");
    tablerow.classList.add(y);
    row.forEach((cell, x) => {
      cellElement = createCell(b, x, y);
      cellElement.id = y * b[0].length + x;
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

  if (
    x < 0 ||
    x > b[0].length - 1 ||
    y < 0 ||
    y > b.length - 1 ||
    b[y][x].mine ||
    b[y][x].revealed
  ) {
    return;
  }

  let c = document.getElementById(y * b[0].length + x);

  if (!b[y][x].adjacent == 0) {
    c.innerHTML = b[y][x].mine
      ? "💣"
      : b[y][x].adjacent == 0
      ? " "
      : b[y][x].adjacent;
    c.classList.add("revealed");
    b[y][x].revealed = true;

    return;
  }

  c.innerHTML = b[y][x].mine
    ? "💣"
    : b[y][x].adjacent == 0
    ? " "
    : b[y][x].adjacent;
  c.classList.add("revealed");
  b[y][x].revealed = true;

  offsets.forEach((offset) => {
    revealCell(b, x + offset[0], y + offset[1]);
  });
};

const createCell = (b) => {
  let ty,
    tx,
    cell = document.createElement("td");
  cell.addEventListener("click", (e) => {
    ty = Math.floor(e.target.parentNode.className);
    tx = Math.floor(e.target.id % b[0].length);
    console.log(tx, ty);
    if (!b[ty][tx].revealed) {
      if (initial) {
        const excludePositions = new Set();
        offsets.push([0, 0]);
        offsets.forEach((ele) => {
          excludePositions.add(`${tx + ele[0]},${ty + ele[1]}`);
        });

        offsets.forEach((offset) => {
          let ox = tx + offset[0];
          let oy = ty + offset[1];
          let e = b[oy][ox];

          if (typeof e && e.mine) {
            e.mine = false;
            modifyNeighbors(b, ox, oy, -1);
            const [px, py] = placeMine(b, excludePositions);
            modifyNeighbors(b, px, py, 1);
            e.adjacent = 0;
          }
        });

        offsets.pop();
        initial = false;
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
