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
    canvas.width = 1080;
    canvas.height = 720;
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
    self.hasZindex = false;
    self.isBoardEmpty = true;

    self.createBoardData();
  }
  // draw a square
  drawSquare(x, y, color) {
    let self = this;
    let SQ = self.SQ;
    self.ctx.fillStyle = color;
    self.ctx.fillRect(x * SQ, y * SQ, SQ, SQ);

    self.ctx.strokeStyle = 'BLACK';
    self.ctx.strokeRect(x * SQ, y * SQ, SQ, SQ);
  }

  // draw a polygon
  drawPolygon(region) {
    let self = this;
    let SQ = self.SQ;
    let cells = region.bytes;
    let ctx = self.ctx;
    let cellsArray = Array(cells).fill(1);
    let randomMatrixCols = self.getRandomMatrixCols(cells);
    let regionMatrix = appUtils.listToMatrix(cellsArray, randomMatrixCols);
    console.log(regionMatrix);
    // console.log(regionMatrix);

    let color = self.DATA_TYPES_COLORS[region.dataType];

    self.ctx.fillStyle = color;

    self.ctx.beginPath();
    var avaialableCellX = 0;
    var avaialableCellY = 0;
    if (!self.isBoardEmpty) {
      var avaialableCell = self.getAvailableCell();
      console.log(avaialableCell);
      avaialableCellX = avaialableCell[1];
      avaialableCellY = avaialableCell[0];
    }

    console.log(avaialableCellX);
    var lastX = avaialableCellX * SQ,
      lastY = avaialableCellY * SQ;
    self.ctx.moveTo(lastX, lastY);

    for (var r = 0; r < regionMatrix.length; r++) {
      let cols = regionMatrix[r].length;

      self.ctx.lineTo(cols * SQ + lastX, r + lastY);
      for (var c = 0; c < cols; c++) {
        if (self.board[r + avaialableCellY])
          self.board[r + avaialableCellY][c + avaialableCellX] = 1;
        self.ctx.lineTo(cols * SQ + lastX, (r + 1) * SQ + lastY);
      }
      self.ctx.lineTo(0 + lastX, (r + 1) * SQ + lastY);
    }

    console.log(self.board);

    self.ctx.strokeStyle = 'cyan';
    //self.ctx.stroke();
    self.ctx.closePath();
    self.ctx.fill();

    self.ctx.lineWidth = 1;

    self.ctx.font = '16px Arial';
    self.ctx.textAlign = 'center';
    self.ctx.fillStyle = self.isBoardEmpty ? '#FFFF' : '#FFF';

    let regionMatrixLength = regionMatrix.length;

    let textPosX = (regionMatrix[0].length * SQ) / 2.0;
    let textPosY = (SQ / 2 + regionMatrixLength * SQ) / 2.0;
    textPosX = textPosX + lastX;
    textPosY = textPosY + lastY;
    console.log('X ' + textPosX + ' Y ' + textPosY);
    self.ctx.fillText(region.label, textPosX, textPosY);
    //self.ctx.globalCompositeOperation = 'destination-over';

    if (!self.isBoardEmpty) {
      self.ctx.globalCompositeOperation = 'destination-over';
      self.hasZindex = true;
    }

    self.isBoardEmpty = false;
  }

  getRandomMatrixCols(matCols) {
    let boardRegionColsLimit = self.COLS / 3;
    let randomLimit = matCols > 3 ? matCols / 2 : matCols;
    randomLimit =
      randomLimit > boardRegionColsLimit ? boardRegionColsLimit : randomLimit;
    var result = Math.floor(Math.random() * randomLimit) + 1;
    return result;
  }

  getAvailableCell() {
    let self = this;
    for (var r = 0; r < self.ROWS; r++) {
      for (var c = 0; c < self.COLS; c++) {
        let randomRowIndex = self.getRndInteger(r, self.ROWS - 1);
        let randomColIndex = self.getRndInteger(c, self.COLS - 1);
        if (self.board[randomRowIndex][randomColIndex] === 0) {
          return [randomRowIndex, randomColIndex];
        }
      }
    }
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
    // this.drawPolygon({label: 'Charlie', dataType: 'block', bytes: 456});
    // this.drawPolygon({label: 'Foxrit', dataType: 'string', bytes: 29});
    // this.drawPolygon({label: 'Tango', dataType: 'string', bytes: 70});
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
