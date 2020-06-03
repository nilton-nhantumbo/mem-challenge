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
      string: '#72B317',
      boolean: '#A00ABD',
      block: '#FF0000',
      integer: '#EEC78F',
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
    //self.ctx.strokeStyle = 'cyan';
    //self.ctx.strokeRect(x * SQ, y * SQ, SQ, SQ);

    self.ctx.globalCompositeOperation = 'destination-over';
    self.ctx.fillStyle = color;
    self.ctx.fillRect(
      x * SQ,
      y * SQ,
      SQ + paddingAdjustRatio,
      SQ + paddingAdjustRatio,
    );
  }

  // draw a polygon
  drawPolygon(region) {
    let self = this;
    let SQ = self.SQ;
    let cells = region.bytes;
    let ctx = self.ctx;
    self.ctx.beginPath();
    //var regionMatrixData = self.getAvailableMatrix(cells);
    let color = self.DATA_TYPES_COLORS[region.dataType];

    // if (!regionMatrixData) {
    //   let regionMatrix = regionMatrixData.matrix;

    //   let avaialableCellX = regionMatrixData.colIndex;
    //   let avaialableCellY = regionMatrixData.rowIndex;

    //   for (var r = 0; r < regionMatrix.length; r++) {
    //     let cols = regionMatrix[r].length;
    //     for (var c = 0; c < cols; c++) {
    //       self.board[r + avaialableCellY][c + avaialableCellX] = 1;
    //       self.drawSquare(avaialableCellX + c, avaialableCellY + r, color);
    //     }
    //   }
    // } else {
    let regionMatrix = self.generateAlternativeMatrix(cells);
    let avaialableCellX = regionMatrix[0][1];
    let avaialableCellY = regionMatrix[0][0];
    console.log(regionMatrix);
    // console.log('cx ' + avaialableCellX + ' cy ' + avaialableCellY);
    for (var r = 0; r < regionMatrix.length; r++) {
      for (var c = 0; c < regionMatrix.length; c++) {
        let x = regionMatrix[r][1];
        let y = regionMatrix[r][0];
        self.board[y][x] = 1;
        self.drawSquare(x, y, color);
      }
    }
    // }
    self.ctx.closePath();
  }

  drawText() {
    // self.ctx.font = '16px Arial';
    // self.ctx.textAlign = 'center';
    //   self.ctx.fillStyle = self.isBoardEmpty ? '#FFFF' : '#FFF';

    //   let regionMatrixLength = regionMatrix.length;

    //   let textPosX = (regionMatrix[0].length * SQ) / 2.0;
    //   let textPosY = (SQ / 2 + regionMatrixLength * SQ) / 2.0;
    //   textPosX = textPosX + lastX;
    //   textPosY = textPosY + lastY;
    //   console.log('X ' + textPosX + ' Y ' + textPosY);
    //   self.ctx.fillText(region.label, textPosX, textPosY);
    self.ctx.globalCompositeOperation = 'destination-over';

    //   if (!self.isBoardEmpty) {
    //  //   self.ctx.globalCompositeOperation = 'destination-over';
    //     self.hasZindex = true;
    //   }
  }

  generateAlternativeMatrix(cells) {
    let self = this;
    let freeCell = self.getAvailableCell();
    var freeRowIndex = freeCell[0];
    var freeColIndex = freeCell[1];

    var matrix = [freeCell];

    //Move Right
    for (var i = 1; i < cells; i++) {
      for (var j = 0; j < 4; j++) {
        if (j === 1) {
          //Cell move Right
          var cellMoveX = freeColIndex + 1;
          if (
            self.isCellAvailable(freeRowIndex, cellMoveX) &&
            !self.isCellinMatrix(matrix, freeRowIndex, cellMoveX)
          ) {
            freeColIndex = cellMoveX;
            matrix.push([freeRowIndex, freeColIndex]);
            break;
          }
        } else if (j === 0) {
          //Cell move Top
          var cellMoveY = freeRowIndex - 1;
          if (
            self.isCellAvailable(cellMoveY, freeColIndex) &&
            !self.isCellinMatrix(matrix, cellMoveY, freeColIndex)
          ) {
            freeRowIndex = cellMoveY;
            matrix.push([freeRowIndex, freeColIndex]);
            break;
          }
        } else if (j === 2) {
          //Cell move Left
          var cellMoveX = freeColIndex - 1;
          if (
            self.isCellAvailable(freeRowIndex, cellMoveX) &&
            !self.isCellinMatrix(matrix, freeRowIndex, cellMoveX)
          ) {
            freeColIndex = cellMoveX;
            matrix.push([freeRowIndex, freeColIndex]);
            break;
          }
        } else if (j === 3) {
          //Cell move Bottom
          var cellMoveY = freeRowIndex + 1;
          if (
            self.isCellAvailable(cellMoveY, freeColIndex) &&
            !self.isCellinMatrix(matrix, cellMoveY, freeColIndex)
          ) {
            freeRowIndex = cellMoveY;
            matrix.push([freeRowIndex, freeColIndex]);
            break;
          }
        }
      }
    }

    return matrix;
  }

  isCellinMatrix(matrix, row, col) {
    let self = this;
    for (var r = 0; r < matrix.length; r++) {
      if (matrix[r][0] === row && matrix[r][1] === col) {
        return true;
      }
    }
    return false;
  }
  getAvailableMatrix(cells) {
    let self = this;
    let maxRetries = self.ROWS * self.COLS;
    var matrix;
    for (var i = 0; i < maxRetries; i++) {
      matrix = self.generateAcceptableMatrix(cells);
      if (matrix) {
        return matrix;
      }
    }
    return matrix;
  }

  generateAcceptableMatrix(cells) {
    let self = this;
    let cellsArray = Array(cells).fill(1);

    let randomMatrixCols = self.getRandomMatrixCols(cells);
    let regionMatrix = appUtils.listToMatrix(cellsArray, randomMatrixCols);

    let freeCell = self.getAvailableCell();
    let freeRowIndex = freeCell[0];
    let freeColIndex = freeCell[1];

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

  getRandomMatrixCols(matCols) {
    let self = this;
    let boardRegionColsLimit = self.COLS / 2;
    let randomLimit = matCols > 3 ? matCols / 2 : matCols;
    randomLimit =
      randomLimit > boardRegionColsLimit ? boardRegionColsLimit : randomLimit;

    var result = 0;

    for (var i = boardRegionColsLimit; i > 0; i--) {
      if (i * i == matCols) {
        return i;
      }
    }

    if (result == 0) {
      for (var i = boardRegionColsLimit; i > 1; i--) {
        var moodle = matCols % i == 0;
        if (matCols / moodle < self.maxAcceptedRowIndex && moodle == 0) {
          console.log(i);
          return i;
        }
      }
    }
    if (result == 0) {
      var o = self.getRndInteger(3, randomLimit);
      return o;
    }
  }
  getAvailableCell() {
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
      rowIndex < self.maxAcceptedRowIndex &&
      colIndex < self.maxAcceptedColIndex &&
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

    this.drawPolygon({label: 'Alfa', dataType: 'integer', bytes: 4});
    this.drawPolygon({label: 'Kilo', dataType: 'boolean', bytes: 1});
    this.drawPolygon({label: 'Bravo', dataType: 'string', bytes: 40});
    this.drawPolygon({label: 'Foxrit', dataType: 'string', bytes: 29});
    this.drawPolygon({label: 'Tango', dataType: 'string', bytes: 70});
    this.drawPolygon({label: 'Charlie', dataType: 'block', bytes: 358});
  }

  // draw the board
  drawBoard2() {
    let self = this;
    for (var r = 0; r < self.ROWS; r++) {
      for (var c = 0; c < self.COLS; c++) {
        self.drawSquare(c, r, self.VACANT);
      }
    }
  }
  drawBoard() {
    let self = this;
    let bw = self.SQ * self.COLS;
    let bh = self.SQ * self.ROWS;
    for (var x = 0; x <= bw; x += self.SQ) {
      self.ctx.moveTo(0.5 + x, 0);
      self.ctx.lineTo(0.5 + x, bh);
    }

    for (var y = 0; y <= bh; y += self.SQ) {
      self.ctx.moveTo(0, 0.5 + y);
      self.ctx.lineTo(bw, 0.5 + y);
    }

    self.ctx.strokeStyle = 'black';
    self.ctx.stroke();
  }
}
export {appUtils, boardUtils};
