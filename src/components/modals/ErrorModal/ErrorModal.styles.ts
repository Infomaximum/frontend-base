import { scrollDefaultStyle } from "src/styles/global.styles";
import { EUserAgents, userAgent } from "@im/utils";

const bodyModalPadding = 32;
const modalPadding = 48;
const marginTopText = 8;

export const titleStyle = (theme: TTheme) => ({
  fontSize: `${theme.subtitleFontSize}px`,
  fontWeight: "bold" as const,
  lineHeight: "24px",
});

export const textStyle =
  (titleHeight: number, footerHeight: number) => (theme: TTheme) =>
    ({
      margin: `${marginTopText}px 0px 0px`,
      color: theme.grey8Color,
      overflowY: "auto",
      display: "flex",
      flexDirection: "column",
      wordBreak: "break-word",
      maxHeight:
        userAgent() === EUserAgents.MSIE
          ? `calc(100vh - ${
              /* Фикс высоты в IE, в других браузерах нормально определяется максимальная высота
               * Высота описания ошибка + высота футора + 1px бордер у футора + паддинги тела модалки(верхний и нижний, поэтому x2) +
               * + паддинги самой модалки от края экрана(верхний и нижний, поэтому x2) + margin от текста ошибки то тайтла
               */
              titleHeight +
              footerHeight +
              1 +
              bodyModalPadding * 2 +
              modalPadding * 2 +
              marginTopText
            }px)`
          : undefined,
    } as const);

export const iconWrapStyle = {
  position: "absolute" as const,
};

export const modalContentStyle = {
  marginLeft: "40px",
  whiteSpace: "pre-wrap",
  display: "flex",
  flexDirection: "column",
  width: "100%",
} as const;

export const modalFooterStyle = {
  textAlign: "right" as const,
};

export const errorIconStyle = (theme: TTheme) => ({
  color: theme.red6Color,
  fontSize: "24px",
});

export const infoIconStyle = (theme: TTheme) => ({
  color: theme.blue6Color,
  fontSize: "24px",
});

export const bodyModalStyle = {
  padding: `${bodyModalPadding}px`,
  overflow: "hidden",
  display: "flex",
};

export const modalStyle = (theme: TTheme) =>
  ({
    ".ant-modal-centered": {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },

    ".ant-modal-content": {
      maxHeight: "100%",
      display: "flex",
      flexDirection: "column",
      minHeight: "136px",
      width: "100%",
    },

    padding: `${modalPadding}px 0`,
    height: "100%",
    display: "inline-flex !important",
    alignItems: "center",
    justifyContent: "center",
    ...scrollDefaultStyle(theme),
  } as const);
