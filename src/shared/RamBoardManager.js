import appUtils from './utils';
class RamBoardManager {
  constructor(containerId, ramData, squareSize) {
    let self = this;

    self.buildRamBoard(containerId, ramData, squareSize);
  }

  buildRamBoard(containerId, ramData, squareSize) {
    let self = this;
    //console.log(containerId);
    self.initRamBoard(containerId, ramData, squareSize);
    self.createRamBoardStructure(32);
    self.drawMemoryBoard();
    self.allocateRegions(ramData.data.regions);
    self.addCanvasRegionsListener();
  }

  initRamBoard(containerId, ramData, squareSize) {
    let self = this;
    //intializing variables
    self.DATA_TYPES_COLORS = {
      string: '#acc73e',
      boolean: '#3e8cc7',
      block: '#c73e5b',
      integer: '#f5bc4c',
    };
    self.allocatedRegions = [];
    self.canvas;
    self.ramData = ramData;
    self.totalBytes = ramData.data.bytes;
    self.board = [];
    self.ROWS = 0;
    self.COLS = 0;
    self.SQ = squareSize;
    self.maxAcceptedRowIndex = 0;
    self.maxAcceptedColIndex = 0;
    self.initCanvasBoard(containerId);
  }

  initCanvasBoard(containerId) {
    let self = this;
    let container = document.getElementById(containerId);
    var canvas = document.createElement('canvas');

    canvas.id = 'canvas_' + containerId;
    canvas.width = 1280;
    canvas.height = 720;
    container.appendChild(canvas);

    self.canvas = canvas;
    self.ctx = canvas.getContext('2d');
  }

  createRamBoardStructure(maxCols) {
    let self = this;
    let bytes = self.totalBytes;
    var cols = 0;
    var rows = 0;
    for (var i = maxCols; i > 1; i--) {
      if (bytes % i == 0) {
        cols = i;
        rows = bytes / i;
        break;
      }
    }
    if (cols > 0 && rows > 0 && cols > rows) {
      self.ROWS = rows;
      self.COLS = cols;
    } else {
      self.createRamBoardStructure(maxCols + 1);
    }
    self.maxAcceptedRowIndex = self.ROWS - 1;
    self.maxAcceptedColIndex = self.COLS - 1;
  }

  // create the board
  drawMemoryBoard() {
    let self = this;
    for (var r = 0; r < self.ROWS; r++) {
      self.board[r] = [];
      for (var c = 0; c < self.COLS; c++) {
        self.board[r][c] = 0;
      }
    }
    self.drawBoard();
  }

  allocateRegions(regions) {
    let self = this;
    // console.log(regions[0].data);
    // self.allocateRegionCellsToMemory(regions[0]);
    regions.forEach((region) => {
      self.allocateRegionBytesToMemory(region);
      if (region.data.regions) {
        self.allocateRegions(region.data.regions);
      }
    });
  }

  // draw a polygon
  allocateRegionBytesToMemory(region) {
    let self = this;
    let SQ = self.SQ;
    let cells = region.bytes;
    let ctx = self.ctx;
    let bytesPositions = [];

    var lastX = 0;
    var lastY = 0;

    var textRowSize = 0;
    var textColSize = 0;

    var regionMatrixData = self.generateMatrix(cells);
    let color = self.DATA_TYPES_COLORS[region.dataType];
    let regionMatrix = regionMatrixData.matrix;
    if (regionMatrixData && regionMatrix && regionMatrix.length > 0) {
      let avaialableCellX = regionMatrixData.colIndex;
      let avaialableCellY = regionMatrixData.rowIndex;
      let marginCase = 1;
      for (var r = 0; r < regionMatrix.length; r++) {
        let cols = regionMatrix[r].length;
        for (var c = 0; c < cols; c++) {
          let x = avaialableCellX + c;
          let y = r + avaialableCellY;
          bytesPositions.push([x, y]);
          self.board[y][x] = 1;
          self.drawSquare(x, y, color);
          if (r == 0 && c == cols - 1) {
          }

          //create margins
          if (
            (r == 0 && c == 0) ||
            (r == 0 && c == cols - 1) ||
            (r == regionMatrix.length - 1 && c == 0) ||
            (r == regionMatrix.length - 1 && c == cols - 1)
          ) {
            self.createRegionMarginOnBoard(marginCase, y, x);
            marginCase++;
          }
        }
      }
      let textPos = self.getRegionTextPosiotion(
        regionMatrix,
        avaialableCellX,
        avaialableCellY,
      );
      self.drawText(region.label, textPos.x, textPos.y);
      self.allocatedRegions.push({
        label: region.label,
        bytes: region.bytes,
        data: region.data,
        dataType: region.dataType,
        bytesPositions: bytesPositions,
        wasClicked: false,
        textRepreRow: regionMatrix.length,
        textRepreCol: regionMatrix[0].length,
        textReprePosX: avaialableCellX,
        textReprePosY: avaialableCellY,
        labelPosX: textPos.x,
        labelPosY: textPos.y,
      });
    }
  }

  isMemoryFull() {
    let self = this;
    return self.getNumberOfAvailableCellsBytes() === 0;
  }

  createRegionMarginOnBoard(marginCase, row, col) {
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
          self.board[cellMoveY][col] = 2;
        }
        cellMoveX = col - 1;
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

  getNumberOfAvailableCellsBytes() {
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
        if (matrix) {
          break;
        }
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

    var o = appUtils.getRndInteger(3, randomLimit);
    return o;
  }

  getRandomAvailableCell() {
    let self = this;
    for (var r = 0; r < self.ROWS * self.SQ; r++) {
      let randomRowIndex = appUtils.getRndInteger(0, self.ROWS - 1);
      let randomColIndex = appUtils.getRndInteger(0, self.COLS - 1);
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

  getRegionTextPosiotion(regionMatrix, lastX, lastY) {
    let self = this;
    let SQ = self.SQ;
    let regionMatrixLength = regionMatrix.length;
    let textPosX = (regionMatrix[0].length * SQ) / 2.0;
    let textPosY = (SQ / 2 + regionMatrixLength * SQ) / 2.0;
    textPosX = lastX * SQ + textPosX;
    textPosY = lastY * SQ + textPosY;

    return {x: textPosX, y: textPosY};
  }

  getAllocatedRegion(pX, pY) {
    let self = this;
    let result = null;
    for (var i = 0; i < self.allocatedRegions.length; i++) {
      let region = self.allocatedRegions[i];
      for (var j = 0; j < region.bytesPositions.length; j++) {
        let bytePos = region.bytesPositions[j];
        let x = bytePos[0];
        let y = bytePos[1];
        if (pX == x && pY == y) {
          return region;
        }
      }
    }
  }

  addCanvasRegionsListener() {
    let self = this;
    self.onRegionHover();
    self.onRegionClick();
  }

  onRegionHover() {
    let self = this;
    let SQ = self.SQ;
    self.canvas.addEventListener('mousemove', (evt) => {
      var mouse = self.onMousePos(self.canvas, evt);
      //for loop of each allocated region
      for (var r = 0; r < self.board.length; r++) {
        for (var c = 0; c < self.board[r].length; c++) {
          var hoveredRegion = null;
          self.ctx.beginPath();
          // draw the rect
          self.ctx.rect(c * SQ, r * SQ, SQ, SQ);
          // if thr mouse is inside the rect
          if (self.ctx.isPointInPath(mouse.x, mouse.y)) {
            self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);
            self.drawBoard();
            self.drawAllocatedRegions();
            hoveredRegion = self.getAllocatedRegion(c, r);
            if (hoveredRegion) {
              let color = appUtils.pSBC(
                -0.15,
                self.DATA_TYPES_COLORS[hoveredRegion.dataType],
                false,
                true,
              );
              self.drawAllocatedRegion(hoveredRegion, color);
              self.showTooltip(mouse.x + c, mouse.y + r, hoveredRegion);
            }
          }
        }
      }
    });
  }

  onRegionClick() {
    let self = this;
    let SQ = self.SQ;
    self.canvas.addEventListener('click', (evt) => {
      var mouse = self.onMousePos(self.canvas, evt);
      //for loop of each allocated region
      for (var r = 0; r < self.board.length; r++) {
        for (var c = 0; c < self.board[r].length; c++) {
          var clickedRegion = null;
          self.ctx.beginPath();
          // draw the rect
          self.ctx.rect(c * SQ, r * SQ, SQ, SQ);
          // if the mouse is inside the rect
          if (self.ctx.isPointInPath(mouse.x, mouse.y)) {
            clickedRegion = self.getAllocatedRegion(c, r);
            if (clickedRegion) {
              self.showRegionBinaryData(clickedRegion);
            } else {
              self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);
              self.drawBoard();
              self.resetRegionsClickedState();
              self.drawAllocatedRegions();
            }
          }
        }
      }
    });
  }

  // a function to detect the mouse position on the canvas
  onMousePos(canvas, evt) {
    var ClientRect = canvas.getBoundingClientRect();
    return {
      x: Math.round(evt.clientX - ClientRect.left),
      y: Math.round(evt.clientY - ClientRect.top),
    };
  }

  showRegionBinaryData(region) {
    let self = this;
    let SQ = self.SQ;
    self.resetRegionsClickedState();
    self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);
    self.drawBoard();
    region.wasClicked = true;
    self.drawAllocatedRegions();
    region.bytesPositions.forEach((bytePos, index) => {
      let x = bytePos[0];
      let y = bytePos[1];
      self.drawRegionBinaryValueOnCell(x, y, region.data.binary[index]);
    });
    let text = region.data.text;
    if (text) {
      var maxWidth = 220;
      var lineHeight = 18;
      var rectWidth = 250;
      var rectHeight = 60;
      let words = self.wrapText(text, x, y, maxWidth, lineHeight, rectHeight);
      let textPosX = region.textRepreCol * SQ;
      let x = region.textReprePosX * SQ + textPosX;
      let y = region.textReprePosY * SQ;
      console.log(x + ' ' + y);
      self.ctx.fillStyle = '#E1FFC7';

      let minRectHeight = words.length * 5;
      minRectHeight = minRectHeight < 28 ? minRectHeight * 4 : minRectHeight;
      self.ctx.fillRect(x, y, rectWidth, minRectHeight);
      self.ctx.fillStyle = 'black';
      self.drawWords(
        self.ctx,
        text,
        x + +10 + x * 0.02,
        y + 15,
        maxWidth,
        lineHeight,
        rectHeight,
        words,
      );
    }
  }

  showTooltip(x, y, region) {
    let self = this;
    let paddingAdjustRatio = 0.9;

    let width = 200;
    let height = 68;
    // self.ctx.globalCompositeOperation = 'source-over';
    self.ctx.fillStyle = '#e6f3f5';
    self.ctx.fillRect(x, y, width, height);
    self.ctx.strokeStyle = '#118191';
    self.ctx.lineWidth = 2;
    self.ctx.strokeRect(x, y, width, height);
    self.ctx.font = 'bold 14px Arial';
    self.ctx.textAlign = 'center';
    self.ctx.fillStyle = '#118191';
    let textPosX = x + width / 2;
    let textPosY = y + height / 2;
    self.ctx.fillText(region.dataType, textPosX, textPosY);
    self.ctx.font = '11px Arial';
    self.ctx.textAlign = 'center';
    self.ctx.fillText(region.bytes + ' bytes', textPosX, textPosY + 16);
  }

  resetRegionsClickedState() {
    let self = this;
    self.allocatedRegions
      .filter(({wasClicked}) => wasClicked)
      .forEach((region) => {
        region.wasClicked = false;
      });
  }

  wrapText(text, x, y, maxWidth, lineHeight, rectHeight) {
    var words = text.split(' ');
    return words;
  }

  drawWords(context, text, x, y, maxWidth, lineHeight, rectHeight, words) {
    var line = '';
    context.textAlign = 'start';
    for (var n = 0; n < words.length; n++) {
      var testLine = line + words[n] + ' ';
      var metrics = context.measureText(testLine);
      var testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        context.fillText(line, x, y);
        line = words[n] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    context.fillText(line, x, y);
    rectHeight = rectHeight + lineHeight;
  }

  drawAllocatedRegions() {
    let self = this;
    self.allocatedRegions.forEach((region) => {
      let color = self.DATA_TYPES_COLORS[region.dataType];
      self.drawAllocatedRegion(region, color);
    });
  }

  drawAllocatedRegion(region, color) {
    let self = this;
    region.bytesPositions.forEach((bytePos, index) => {
      let x = bytePos[0];
      let y = bytePos[1];
      self.drawSquare(x, y, color);
      if (region.wasClicked)
        self.drawRegionBinaryValueOnCell(x, y, region.data.binary[index]);
    });
    if (!region.wasClicked)
      self.drawText(region.label, region.labelPosX, region.labelPosY);
  }

  drawRegionBinaryValueOnCell(x, y, byteValue) {
    let self = this;
    let SQ = self.SQ;
    self.drawSquareStroke(x, y, 'black');
    x = x * SQ + SQ / 2;
    y = y * SQ + SQ / 2 + 4;
    self.ctx.font = '11px Arial';
    self.ctx.textAlign = 'center';
    self.ctx.fillStyle = '#FFF';
    self.ctx.fillText(byteValue, x, y);
  }

  drawText(label, textPosX, textPosY) {
    let self = this;
    self.ctx.font = '14px Arial';
    self.ctx.textAlign = 'center';
    self.ctx.fillStyle = '#FFF';
    self.ctx.fillText(label, textPosX, textPosY);
  }
  // draw the board
  drawBoard() {
    let self = this;
    for (var r = 0; r < self.ROWS; r++) {
      for (var c = 0; c < self.COLS; c++) {
        self.drawSquareStroke(c, r, '#bfbfbf');
      }
    }
  }

  // draw a square
  drawSquare(x, y, color) {
    let self = this;

    let paddingAdjustRatio = 0.9;

    let SQ = self.SQ;
    self.ctx.globalCompositeOperation = 'source-over';
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

    //self.ctx.globalCompositeOperation = 'destination-over';
    let SQ = self.SQ;

    self.ctx.strokeStyle = color;
    self.ctx.lineWidth = 0.22;
    self.ctx.strokeRect(x * SQ, y * SQ, SQ, SQ);
  }
}
export default RamBoardManager;
