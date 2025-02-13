import { buttonStyle } from "../FilterList/Buttons/FilterPanelButtons.styles";

export const wrapperPanelStyle = {
  display: "flex",
  height: "100%",
};

export const getButtonRemoveFilterStyle = (isDisabled: boolean) => (theme: TTheme) => {
  const styles = {
    ...buttonStyle(theme),
  };

  isDisabled && (styles.color = theme.grey7Color);

  return styles;
};

export const addTopPanelFilterButtonStyle = {
  width: "28px",
  height: "28px",
};
