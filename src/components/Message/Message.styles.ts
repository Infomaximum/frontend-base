export const messageStyle = (theme: TTheme) =>
  ({
    textAlign: "left",
    wordWrap: "break-word",
    overflowWrap: "anywhere",
    maxWidth: "390px",
    overflow: "hidden",
    display: "-webkit-box",
    WebkitLineClamp: "8",
    WebkitBoxOrient: "vertical",
    color: theme.grey10Color,
  }) as const;

export const getNotificationsWrapperStyle = (closable: boolean) => (theme: TTheme) => ({
  paddingRight: closable ? "21px" : 0,
  ...messageStyle(theme),
});

export const entityStyle = (theme: TTheme) => ({
  color: theme.grey10Color,
});

export const getMessageNoticeStyle = (noticeStyle?: React.CSSProperties) =>
  ({
    maxWidth: "464px",
    textAlign: "right",
    marginLeft: "auto",
    zIndex: 2000,
    ...noticeStyle,
  }) as const;

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
  }) as const;

export const closeIconHoverStyle = (theme: TTheme) => ({
  ":hover": {
    color: `${theme.grey10Color}!important`,
  },
});

export const switchedEnabledStyle = (theme: TTheme) => ({
  color: theme.green7Color,
});

export const switchedOffStyle = (theme: TTheme) => ({
  color: theme.red7Color,
});

export const nameStyle = (theme: TTheme) => ({
  color: theme.grey10Color,
});
