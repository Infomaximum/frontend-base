import { EUserAgents, userAgent } from "@infomaximum/utility";
import { ellipsisStyle } from "../../../../styles/common.styles";

const isSafari = userAgent() === EUserAgents.Safari;

export const tableLinkStyle = (theme: TTheme) =>
  ({
    // todo: разобраться почему не работает line-height в обычных таблицах
    display: "block !important",
    width: "100%",
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

    ...ellipsisStyle,
  }) as const;
