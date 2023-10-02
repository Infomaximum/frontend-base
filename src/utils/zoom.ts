/**
 * Возвращает размер, который не будет дробным при заданном масштабе
 * @param size - размер, который нужно исправить
 * @param zoomRatio - коэффициент масштабирования
 * @returns {number} - исправленный размер
 */
export const getFixedSizeByZoom = (size: number, zoomRatio: number) => {
  if (size > 1) {
    // Большие числа нужно округлять в большую сторону, так как они скорее всего подразумевают высоту блока, а её нельзя делать меньше чем внутренние элементы
    return Math.ceil(size * zoomRatio) / zoomRatio;
  } else {
    // Маленькое число скорее всего бордюр, его округляем обычным round, т.к. иначе даже при zoomRatio=1.1 результат будет 2
    return Math.round(size * zoomRatio) / zoomRatio;
  }
};
