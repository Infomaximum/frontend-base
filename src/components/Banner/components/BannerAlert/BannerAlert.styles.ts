export const wrapperBannerAlertStyle = (backgroundColor?: string) =>
  ({
    backgroundColor,
    display: "flex",
    flexDirection: "row",
    padding: "8px 15px",
    justifyContent: "space-between",
  } as const);

export const iconBannerAlertStyle = {
  display: "flex",
  flex: "0 0 auto",
  fontSize: "20px",
  marginRight: "8px",
};

export const closeIconBannerAlertStyle = {
  fontSize: "14px",
  cursor: "pointer",
  marginLeft: "8px",
  padding: "4px 1px",
};

export const wrapperContentBannerAlertStyle = {
  display: "flex",
};
