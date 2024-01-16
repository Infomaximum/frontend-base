type TRgb = { red: number; green: number; blue: number };

/**
 * Функция преобразует цвет из формата hex в rgb
 * @param {string} hex - формат цвета, который лежит в theme
 * @returns {string} цвет, имеющий формат rgb (red, green, blue)
 */
export const colorConversionFromHexToRgb = (hex: string): TRgb => {
  let red: string = "0",
    green: string = "0",
    blue: string = "0";

  /**
   * Мы знаем, что длина шестнадцатеричного значения должна быть 3 или 6 (плюс #).
   * В любом случае мы начинаем каждое значение red, green и blue, "0x"чтобы преобразовать их в шестнадцатеричный формат.
   * Если мы предоставляем трехзначное значение, мы объединяем одно и то же значение дважды для каждого канала.
   * Если это 6-значное значение, мы объединяем первые два для красного, следующие два для зеленого и последние два для синего
   */
  if (hex.length === 4) {
    red = `0x${hex[1]}${hex[1]}`;
    green = `0x${hex[2]}${hex[2]}`;
    blue = `0x${hex[3]}${hex[3]}`;
  } else if (hex.length === 7) {
    red = `0x${hex[1]}${hex[2]}`;
    green = `0x${hex[3]}${hex[4]}`;
    blue = `0x${hex[5]}${hex[6]}`;
  }

  return { red: Number(red), green: Number(green), blue: Number(blue) };
};

/**
 * Функцию полезно использовать, если нужно сделать прозрачный background блока,
 * сохранив непрозрачность содержащихся элементов
 */
export const convertHexToRgbaStyle = (hex: string, opacity: number) => {
  const { red, green, blue } = colorConversionFromHexToRgb(hex);

  return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
};

/**
 * Возвращает rgba цвета для градиента из прозрачного в заданный (по умолчанию - в белый)
 */
export const getGradientColorsFromTransparent = (theme: TTheme, maxOpacityColor?: string) => ({
  // rgba(255, 255, 255, 0) необходимо для корректного отображения градиента в Safari
  minOpacity: convertHexToRgbaStyle(theme.grey1Color, 0),
  maxOpacity: convertHexToRgbaStyle(maxOpacityColor ?? theme.grey1Color, 1),
});
