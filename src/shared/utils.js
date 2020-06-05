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

  static getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

export default appUtils;
