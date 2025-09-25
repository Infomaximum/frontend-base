export const tableCheckboxCellStyle = (theme: TTheme) =>
  ({
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    ".ant-checkbox-wrapper": {
      position: "absolute",
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      minHeight: `${theme.commonTableRowHeight}px`,
      ".ant-checkbox": {
        margin: "auto",
        top: 0,
      },
    },
    ".radio-wrapper": {
      justifyContent: "center",
      position: "absolute",
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      minHeight: `${theme.commonTableRowHeight}px`,
    },
  }) as const;
