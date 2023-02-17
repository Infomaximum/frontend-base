import { calcShrinkMask } from "./Breadcrumbs.utils";

describe("Тест Breadcrumbs", () => {
  it("Тест порядка сжатия Breadcrumbs", () => {
    const cases = [
      {
        params: { widths: [100, 100, 100], maxTotalWidth: 250, minWidth: 20 },
        result: [true, false, false],
      },
      {
        params: { widths: [100, 200, 100], maxTotalWidth: 300, minWidth: 20 },
        result: [false, true, false],
      },
      {
        params: { widths: [100, 100, 200], maxTotalWidth: 250, minWidth: 20 },
        result: [false, false, true],
      },
      {
        params: { widths: [100, 100, 100], maxTotalWidth: 200, minWidth: 20 },
        result: [true, true, false],
      },
      {
        params: { widths: [100, 200, 300], maxTotalWidth: 300, minWidth: 20 },
        result: [true, false, true],
      },
      {
        params: { widths: [100, 200, 200], maxTotalWidth: 150, minWidth: 20 },
        result: [false, true, true],
      },
      {
        params: { widths: [100, 100, 100], maxTotalWidth: 100, minWidth: 20 },
        result: [true, true, true],
      },
      {
        params: { widths: [100, 100], maxTotalWidth: 150, minWidth: 20 },
        result: [true, false],
      },
      {
        params: { widths: [80, 100], maxTotalWidth: 100, minWidth: 20 },
        result: [false, true],
      },
    ];

    cases.forEach(({ params, result }) => {
      expect(calcShrinkMask(params.widths, params.maxTotalWidth, params.minWidth)).toEqual(result);
    });
  });
});
