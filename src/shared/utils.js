class appUtils {
  static listToMatrix(list, elementsPerSubArray) {
    var matrix = [],
      i,
      k;

    for (i = 0, k = -1; i < list.length; i++) {
      if (i % elementsPerSubArray === 0) {
        k++;
        matrix[k] = [];
      }

      matrix[k].push(list[i]);
    }

    return matrix;
  }
}

//Canvas Utils
const Cell_Side_Moves = {
  LEFT: 0,
  TOP: 1,
  RIGHT: 2,
  BOTTOM: 3,
  TOP_LEFT: 4,
  TOP_RIGHT: 5,
  BOTTOM_RIGHT: 6,
  BOTTOM_LEFT: 7,
};

class boardUtils {
  constructor(containerId, rows, cols, squareSize) {
    let self = this;

    let container = document.getElementById(containerId);
    var canvas = document.createElement('canvas');

    canvas.id = 'canvas_' + containerId;
    canvas.width = 920;
    canvas.height = 920;
    canvas.style.zIndex = 8;
    canvas.style.position = 'relative';
    container.appendChild(canvas);

    self.canvas = document.getElementById(canvas.Id);
    self.ctx = canvas.getContext('2d');

    //intializing variables
    self.board = [];
    self.ROWS = rows;
    self.COLS = cols;
    self.SQ = squareSize;
    self.VACANT = '#FFFFFF';

    self.DATA_TYPES_COLORS = {
      string: '#acc73e',
      boolean: '#3e8cc7',
      block: '#c73e5b',
      integer: '#f5bc4c',
    };

    self.isBoardEmpty = true;
    self.maxAcceptedRowIndex = self.ROWS - 1;
    self.maxAcceptedColIndex = self.COLS - 1;

    self.createBoardData();
  }
  // draw a square
  drawSquare(x, y, color) {
    let self = this;

    let paddingAdjustRatio = 0.9;

    let SQ = self.SQ;

    self.ctx.globalCompositeOperation = 'destination-over';
    self.ctx.fillStyle = color;
    self.ctx.fillRect(
      x * SQ,
      y * SQ,
      SQ + paddingAdjustRatio,
      SQ + paddingAdjustRatio,
    );
  }
  drawSquareStroke(x, y, color) {
    let self = this;

    let paddingAdjustRatio = 0.9;

    self.ctx.globalCompositeOperation = 'destination-over';
    let SQ = self.SQ;

    self.ctx.strokeStyle = color;
    self.ctx.lineWidth = 0.25;
    self.ctx.strokeRect(x * SQ, y * SQ, SQ, SQ);
  }

  // draw a polygon
  allocateRegionToMemory(region) {
    let self = this;
    let SQ = self.SQ;
    let cells = region.bytes;
    let ctx = self.ctx;
    //self.ctx.beginPath();
    var regionMatrixData = self.generateMatrix(cells);
    let color = self.DATA_TYPES_COLORS[region.dataType];
    let regionMatrix = regionMatrixData.matrix;
    console.log(regionMatrixData);
    if (regionMatrixData && regionMatrix && regionMatrix.length > 0) {
      let avaialableCellX = regionMatrixData.colIndex;
      let avaialableCellY = regionMatrixData.rowIndex;
      let marginCase = 1;
      for (var r = 0; r < regionMatrix.length; r++) {
        let cols = regionMatrix[r].length;
        for (var c = 0; c < cols; c++) {
          self.board[r + avaialableCellY][c + avaialableCellX] = 1;
          self.drawSquare(avaialableCellX + c, avaialableCellY + r, color);
          if (
            (r == 0 && c == 0) ||
            (r == 0 && c == cols - 1) ||
            (r == regionMatrix.length - 1 && c == 0) ||
            (r == regionMatrix.length - 1 && c == cols - 1)
          ) {
            self.createRegionMargin(
              marginCase,
              r + avaialableCellY,
              c + avaialableCellX,
            );
            marginCase++;
          }
        }
      }
      this.drawText(
        region.label,
        regionMatrix,
        avaialableCellX,
        avaialableCellY,
      );
    }
  }

  drawText(label, regionMatrix, lastX, lastY) {
    let self = this;
    let SQ = self.SQ;

    self.ctx.font = '14px Arial';
    self.ctx.textAlign = 'center';
    self.ctx.fillStyle = self.isBoardEmpty ? '#FFFF' : '#FFF';
    let regionMatrixLength = regionMatrix.length;
    self.ctx.globalCompositeOperation = 'source-over';
    let textPosX = (regionMatrix[0].length * SQ) / 2.0;
    let textPosY = (SQ / 2 + regionMatrixLength * SQ) / 2.0;
    textPosX = lastX * SQ + textPosX;
    textPosY = lastY * SQ + textPosY;
    console.log('X ' + textPosX + ' Y ' + textPosY + ' ' + label);
    self.ctx.fillText(label, textPosX, textPosY);
  }

  createRegionMargin(marginCase, row, col) {
    let self = this;
    var cellMoveX = 0;
    var cellMoveY = 0;
    switch (marginCase) {
      case 1:
        cellMoveX = col - 2;
        cellMoveY = row - 2;
        if (self.isCellAvailable(cellMoveY, cellMoveY)) {
          self.board[cellMoveY][cellMoveX] = 2;
        }
      case 2:
        cellMoveX = col + 1;
        cellMoveY = row - 2;
        if (self.isCellAvailable(cellMoveY, cellMoveY)) {
          self.board[cellMoveY][cellMoveX] = 2;
        }
        break;
      case 3:
        cellMoveX = col + 1;
        cellMoveY = row + 1;
        if (self.isCellAvailable(cellMoveY, cellMoveY)) {
          self.board[cellMoveY][cellMoveX] = 2;
        }
        cellMoveX = col - 1;
        cellMoveY = row + 1;
        if (self.isCellAvailable(cellMoveY, cellMoveY)) {
          self.board[cellMoveY][cellMoveX] = 2;
        }
        cellMoveY = row + 1;
        if (self.isCellAvailable(cellMoveY, cellMoveY)) {
          self.board[cellMoveY][col] = 1;
        }
        cellMoveX = col - 1
        if (self.isCellAvailable(cellMoveY, cellMoveY)) {
          self.board[row][cellMoveX] = 2;
        }
        break;
      case 4:
        cellMoveX = col + 1;
        cellMoveY = row + 1;
        if (self.isCellAvailable(cellMoveY, cellMoveY)) {
          self.board[cellMoveY][cellMoveX] = 2;
        }
        cellMoveY = row + 2;
        if (self.isCellAvailable(cellMoveY, cellMoveY)) {
          self.board[cellMoveY][col] = 2;
        }
        break;
    }
  }

  isMemoryFull() {
    let self = this;
    return self.getNumberOfAvailableCells() === 0;
  }

  getNumberOfAvailableCells() {
    let self = this;
    var count = 0;
    for (var r = 0; r < self.board.length; r++) {
      for (var c = 0; c < self.board[r].length; c++) {
        if (self.board[r][c] == 0) {
          count++;
        }
      }
    }
    return count;
  }

  generateMatrix(cells) {
    let self = this;
    var dividers = self.getBytesDividers(cells);
    var matrix = [];
    if (dividers && dividers.length > 0) {
      for (var d = 0; d < dividers.length; d++) {
        matrix = self.getFreeRegion(dividers[d], cells);
        if (matrix) break;
      }
    }

    if (!dividers || !matrix || dividers.length < 1 || matrix.length < 1) {
      let maxRetries = self.ROWS * self.COLS;
      var matrix;
      for (var i = 0; i < maxRetries; i++) {
        let divider = self.getRandomBytesDivider(cells);
        matrix = self.getFreeRegion(divider, cells);
        if (matrix) {
          return matrix;
        }
      }
    }

    return matrix;
  }

  getFreeRegion(colsLimit, cells) {
    let self = this;
    for (var r = 0; r < self.board.length; r++) {
      for (var c = 0; c < self.board[r].length; c++) {
        if (self.board[r][c] == 0) {
          var mat = self.getRegionMatrixOnMemory(colsLimit, cells, r, c + 1);
          if (mat) return mat;
        }
      }
    }
    return [];
  }

  getRegionMatrixOnMemory(divider, cells, freeRowIndex, freeColIndex) {
    let self = this;
    let cellsArray = Array(cells).fill(1);
    let regionMatrix = appUtils.listToMatrix(cellsArray, divider);

    for (var r = 0; r < regionMatrix.length; r++) {
      for (var c = 0; c < regionMatrix[r].length; c++) {
        let boardRowIndex = freeRowIndex + r;
        let boardColIndex = freeColIndex + c;
        if (
          boardRowIndex > self.maxAcceptedRowIndex ||
          boardColIndex > self.maxAcceptedColIndex ||
          self.board[boardRowIndex][boardColIndex] === 1
        ) {
          return null;
        }
      }
    }

    return {
      matrix: regionMatrix,
      rowIndex: freeRowIndex,
      colIndex: freeColIndex,
    };
  }

  getBytesDividers(matCols) {
    let self = this;
    var dividers = [];
    let boardRegionColsLimit = self.COLS / 2;

    for (var i = boardRegionColsLimit; i >= 1; i--) {
      if (i * i == matCols) {
        dividers.push(i);
      }
    }

    for (var i = boardRegionColsLimit; i > 1; i--) {
      if (matCols % i == 0) {
        if (dividers.filter((x) => x !== i)) dividers.push(i);
      }
    }

    return dividers;
  }

  getRandomBytesDivider(matCols) {
    let self = this;
    let boardRegionColsLimit = self.COLS / 2;
    let randomLimit = matCols > 3 ? matCols / 2 : matCols;
    randomLimit =
      randomLimit > boardRegionColsLimit ? boardRegionColsLimit : randomLimit;

    var o = self.getRndInteger(3, randomLimit);
    return o;
  }

  getRandomAvailableCell() {
    let self = this;
    for (var r = 0; r < self.ROWS * self.SQ; r++) {
      let randomRowIndex = self.getRndInteger(0, self.ROWS - 1);
      let randomColIndex = self.getRndInteger(0, self.COLS - 1);
      if (self.board[randomRowIndex][randomColIndex] === 0) {
        return [randomRowIndex, randomColIndex];
      }
    }
    return null;
  }

  isCellAvailable(rowIndex, colIndex) {
    let self = this;
    return (
      rowIndex >= 0 &&
      colIndex >= 0 &&
      rowIndex <= self.maxAcceptedRowIndex &&
      colIndex <= self.maxAcceptedColIndex &&
      self.board[rowIndex] &&
      self.board[rowIndex][colIndex] === 0
    );
  }

  getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  // create the board
  createBoardData() {
    let self = this;
    for (var r = 0; r < self.ROWS; r++) {
      self.board[r] = [];
      for (var c = 0; c < self.COLS; c++) {
        self.board[r][c] = 0;
      }
    }

    this.allocateRegionToMemory({label: 'Kilo', dataType: 'boolean', bytes: 1});
    this.allocateRegionToMemory({label: 'Alfa', dataType: 'integer', bytes: 4});
    this.allocateRegionToMemory({
      label: 'Foxrit',
      dataType: 'string',
      bytes: 29,
    });
    this.allocateRegionToMemory({
      label: 'Bravo',
      dataType: 'string',
      bytes: 40,
    });
    this.allocateRegionToMemory({
      label: 'Tango',
      dataType: 'string',
      bytes: 70,
    });
    this.allocateRegionToMemory({
      label: 'Zone-1',
      dataType: 'block',
      bytes: 150,
    });
    this.allocateRegionToMemory({
      label: 'Zone-2',
      dataType: 'block',
      bytes: 244,
    });
    this.allocateRegionToMemory({
      label: 'Counter',
      dataType: 'integer',
      bytes: 4,
    });
    this.allocateRegionToMemory({
      label: 'Phrase',
      dataType: 'string',
      bytes: 35,
    });
    this.allocateRegionToMemory({
      label: 'Zone-4',
      dataType: 'block',
      bytes: 110,
    });
  }

  // draw the board
  drawBoard() {
    let self = this;
    for (var r = 0; r < self.ROWS; r++) {
      for (var c = 0; c < self.COLS; c++) {
        self.drawSquareStroke(c, r, 'BLACK');
        //  self.drawSquare(c, r, self.VACANT);
      }
    }
  }
}
export {appUtils, boardUtils};
