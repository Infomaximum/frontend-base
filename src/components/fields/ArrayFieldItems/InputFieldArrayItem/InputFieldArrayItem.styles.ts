const formOptionHeight = 28;
const removeIconWidth = 16;

export const inputGroupStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

export const wrappedButtonStyle = {
  width: "16px",
  maxWidth: "16px",
  padding: "0 0 0 3px",
  border: 0,
  height: `${formOptionHeight}px`,
} as const;

export const getFormItemStyle = (isShowRemoveButton: boolean) => {
  const gapOffset = isShowRemoveButton ? 8 : 0;
  const removeIconOffset = isShowRemoveButton ? removeIconWidth : 0;

  return { width: `calc(100% - ${removeIconOffset}px - ${gapOffset}px)` };
};
