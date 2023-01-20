export const loaderWrapperStyle = {
  position: "absolute",
  zIndex: 1,
  width: "100%",
  height: "100%",
  maxHeight: "400px",
} as const;

export const getEmptyContentStyle = (maxHeight: number) => () =>
  ({
    padding: "16px",
    height: `${maxHeight}px`,
    overflowY: "auto",
  } as const);

export const withoutDividerStyle = { borderColor: "transparent" };
