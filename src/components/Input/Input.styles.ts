import { textOverflowOverlayStyle, textOverflowWrapperStyle } from "../../styles";

export const disabledInputStyle = (theme: TTheme) => ({
  border: "none",
  overflow: "hidden",
  WebkitTextFillColor: theme.grey7Color, // Safari fix
  backgroundColor: theme.grey3Color,
  color: theme.grey7Color,
});

export const disabledTextAreaStyle = (theme: TTheme) => ({
  borderColor: theme.grey3Color,
  ":hover": {
    borderColor: `${theme.grey3Color} !important`,
  },
  "::placeholder": {
    color: theme.grey7Color,
  },
});

export const resetAutocompleteChromeStyle = {
  boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0), inset 0 0 0 100px rgba(255, 255, 255,1) !important"
};

export const defaultInputStyle = (theme: TTheme) => ({
  color: theme.grey9Color,
  height: "28px",
  padding: "2px 7px",
  ".ant-input-affix-wrapper:focus, .ant-input-affix-wrapper-focused": {
    borderColor: theme.blue4Color,
    boxShadow: `0px 0px 4px 0px ${theme.blue4Color}`,
  },
  input: {
    "::placeholder": {
      textOverflow: "unset",
    },
    // сброс стилей автозаполненных полей в Chrome
    ":-internal-autofill-previewed": {
      ...resetAutocompleteChromeStyle,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: theme.grey9Color,
    },
    ":-internal-autofill-selected": {
      ...resetAutocompleteChromeStyle,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: theme.grey9Color,
    },
  },
});

export const defaultPasswordInputStyle = (theme: TTheme) => ({
  ...defaultInputStyle(theme),
  ".ant-input-suffix": {
    marginRight: "-8px",
    marginLeft: 0,
    zIndex: 10,
    ".ant-input-password-icon.anticon": {
      width: "28px",
      height: "28px",
      display: "flex",
      alignItems: "center",
      paddingLeft: "5px",
      color: theme.grey6Color,
      ":hover": {
        color: theme.grey7Color,
      },
    },
  },
});

export const disabledPasswordInputStyle = {
  ...disabledInputStyle,
  border: "none",
  ".ant-input-password-icon.anticon": {
    display: "none",
  },
};

export const inputWrapperStyle = {
  ...textOverflowWrapperStyle
} as const;

export const inputOverlayStyle = (theme: TTheme, isDisabled: boolean = false, right: string = "8px") =>
  ({
    ...textOverflowOverlayStyle({
      backgroundColor: isDisabled ? theme.grey3Color : theme.grey1Color,
      top: "1px",
      right: right,
      bottom: "1px",
      width: "24px",
      zIndex: 9
    })
  } as const);

export const passwordOverlayStyle = {
  right: "28px",
};
