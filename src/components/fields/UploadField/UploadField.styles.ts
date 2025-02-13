export const draggerStyle = (theme: TTheme) => ({
  background: theme.grey1Color,
  ".ant-upload-hint": {
    margin: "unset",
  },
});

export const getUploadPromptWrapperStyle = (isRuLang: boolean) => ({
  left: isRuLang ? 108 : 90,
});

export const getUploadFieldCaptionStyle = {
  display: "flex",
  alignItems: "center",
};

export const uploadIconStyle = {
  marginTop: "11px",
  marginBottom: "6px",
};

export const uploadListItemStyle = {
  ".ant-upload-list-item-error + .ant-tooltip": {
    display: "none !important",
  },
};

export const uploadWrapperStyle = {
  width: "100%",
  marginBottom: "29px",
  ".ant-upload-list .ant-upload-list-text": {
    position: "relative",
  },
  ".ant-upload-wrapper .ant-upload-list .ant-upload-list-item-container": {
    width: "100%",
    transition: "opacity 0s, height 0s !important",
    position: "absolute",
  },
} as const;
