export const messageStyle = {
  textAlign: "left",
  wordWrap: "break-word",
  overflowWrap: "anywhere",
  maxWidth: "390px",
  overflow: "hidden",
  display: "-webkit-box",
  WebkitLineClamp: "8",
  WebkitBoxOrient: "vertical",
} as const;

export const notificationsWrapperStyle = {
  paddingRight: "21px",
};

export const entityStyle = (theme: TTheme) => ({
  color: theme.grey10Color,
});

export const messageNoticeStyle = {
  maxWidth: "464px",
  textAlign: "right",
  margin: "0px 16px 16px auto",
  zIndex: 2000,
} as const;

// увеличенные padding и отрицательные margin
// позволяют messageBody перекрывать весь блок
// нужно для hover
export const messageBodyStyle = {
  display: "flex",
  padding: "9px 15px 10px 40px",
  margin: "-10px -15px -10px -40px",
  position: "relative",
  zIndex: 10,
  maxWidth: "464px",
  alignItems: "baseline",
} as const;

export const closeIconStyle = (theme: TTheme) =>
  ({
    marginRight: "0px",
    color: `${theme.grey6Color}`,
    fontSize: "12px",
    position: "absolute",
    top: "14px",
    right: "16px",
  } as const);

export const closeIconHoverStyle = (theme: TTheme) => ({
  ":hover": {
    color: `${theme.grey9Color}!important`,
  },
});

export const switchedEnabledStyles = (theme: TTheme) => ({
  color: theme.green7Color,
});

export const switchedOffStyles = (theme: TTheme) => ({
  color: theme.red7Color,
});

export const nameStyles = (theme: TTheme) => ({
  color: theme.grey10Color,
});
