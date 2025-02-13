import { getTextWidth, type TFontSettings } from "./textWidth";

const fontSettings = {
  size: 12,
} satisfies TFontSettings;

const TEXT = "test function text";

describe("Тестирование функции расчета ширины текста с использованием canvas", () => {
  test("Если контекст недоступен и не передан параметр defaultTextWidth, то ширина == 0", () => {
    const originalContext = getTextWidth.context;

    getTextWidth.context = null;

    const width = getTextWidth(TEXT, fontSettings);

    expect(width).toEqual(0);

    getTextWidth.context = originalContext;
  });

  test("Если контекст недоступен и передан параметр defaultTextWidth, то ширина == defaultTextWidth", () => {
    const originalContext = getTextWidth.context;

    getTextWidth.context = null;

    const defaultTextWidth = 24;

    const width = getTextWidth(TEXT, { ...fontSettings, defaultTextWidth });

    expect(width).toEqual(defaultTextWidth);

    getTextWidth.context = originalContext;
  });
});
