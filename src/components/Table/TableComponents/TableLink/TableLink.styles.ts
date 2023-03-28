import { EUserAgents, userAgent } from "@infomaximum/utility";

const isSafari = userAgent() === EUserAgents.Safari;

export const tableLinkStyle = (theme: TTheme) =>
  ({
    // todo: разобраться почему не работает line-height в обычных таблицах
    display: "inline", // необходимо для работы ellipsis: true
    padding: `${theme.tableCellVerticalPadding}px ${theme.tableCellHorizontalPadding / 2}px`,
    margin: `-${theme.tableCellVerticalPadding}px -${theme.tableCellHorizontalPadding / 2}px`,
    height: `${theme.commonTableRowHeight}px`,
    // Если браузер Safari (чтобы убрать браузерный тултип)
    "span > span:after": isSafari
      ? {
          content: "''",
          display: "block",
        }
      : undefined,
  } as const);

export const ellipsisStyle = {
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
} as const;
