# Minesweeper

A classic Minesweeper game implemented in JavaScript [here](https://irrisdev.github.io/minesweeper-js/).

## Features

- Randomly generated minefield
- Safe first click (no mines revealed on the first click)
- Recursive revealing of cells
- Display of mine counts in neighboring cells
- Simple and intuitive user interface

## Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/irrisdev/minesweeper-js.git
    ```

2. Navigate to the project directory:

    ```sh
    cd minesweeper
    ```

## Usage

1. Open the `index.html` file in your web browser.

    ```sh
    open index.html
    ```

2. Follow the on-screen instructions to play the game.

## How to Play

1. **Board Layout**:
   - The board is a grid of cells.
   - Each cell can contain a mine or a number indicating how many mines are adjacent to it.

2. **Game Objective**:
   - Reveal all cells that do not contain mines.

3. **Controls**:
   - Click a cell to reveal it.
   - If the cell is empty (`0`), all contiguous empty cells are revealed.
   - If the cell contains a number, it indicates the number of mines in adjacent cells.
   - If you click a mine, the game is over.
   - Right-click to flag a cell as a mine.

4. **Safe First Click**:
   - The first click is always safe and will never be a mine.


## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

