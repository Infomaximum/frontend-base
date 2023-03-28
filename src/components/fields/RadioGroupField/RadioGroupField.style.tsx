export const radioGroupStyle = (theme: TTheme) => ({
  // увеличение области клика для radio
  "&.ant-radio-group": {
    display: "block",
    ".ant-space": {
      display: "flex",
      ".ant-radio-wrapper": {
        display: "flex",
      },
    },
  },
  // изменение внутренних отступов элемента и изменение размера шрифта
  ".ant-radio-button-wrapper": {
    padding: "0 12px",
    fontSize: `${theme.h5FontSize}px`,
  },
});
