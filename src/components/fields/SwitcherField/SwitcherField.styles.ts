export const switchStyle = {
  margin: "6px 0",
};

export const getSwitcherFormItemStyle = (isLabeled: boolean) =>
  ({
    "&&& .ant-form-item-row": {
      display: "flex",
      flexDirection: isLabeled ? "row-reverse" : "row",
      flexWrap: "nowrap",
      gap: "8px",
    },
    "&&&& .ant-form-item-control": {
      flex: "unset",
      flexGrow: "unset",
      width: "unset",
      maxWidth: "unset",
    },
    "&&&& .ant-form-item-label": {
      flex: "unset",
      flexGrow: 1,
      maxWidth: "unset",
    },
  }) as const;

export const switcherFieldStyle = {
  minHeight: "28px",
  display: "flex",
  alignItems: "center",
};
