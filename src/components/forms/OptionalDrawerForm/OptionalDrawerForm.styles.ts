export const stretchStyle = {
  width: "100%",
};

export const headerStyle = {
  marginBottom: "12px",
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  columnGap: "8px",
};

export const selectWrapperStyle = { width: "180px" };

export const contentWrapperStyle = {
  display: "flex",
  flexDirection: "column",
  height: "100%",
  /** https://stackoverflow.com/questions/48117071/element-with-display-inline-flex-has-a-strange-top-margin
   * Если у дровера в таблице убрать шапку showHeader={false} и выключить строку поиска headerMode={headerModes.NONE},
   * то появлялся отступ сверху у первой строки в случае с isVirtualized={false}
   * и скролл в случае с isVirtualized={true} (при небольшом количестве элементов)
   */
  verticalAlign: "middle",
} as const;
