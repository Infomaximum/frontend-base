import { ellipsisStyle } from "../../styles/common.styles";
import { LOADING_ON_SCROLL_SPINNER_ID } from "../../utils";
import type { TTableOpacity } from "./Table.types";

export const borderTopStyle = (theme: TTheme) =>
  ({
    borderBottom: `1px solid ${theme.grey4Color}`,
    height: "0",
  }) as const;

export const tableWithPaddingDefaultStyle = {
  ".ant-table": {
    borderRadius: "6px",
    padding: "4px 0px 0px 8px",
    // случай, когда у таблицы нет используемых далее контейнеров с нужными классами
    "&:not(:has(.ant-table-body, .ant-table-header))": {
      padding: "4px 8px 20px",
    },
  },
  ".ant-table-header": {
    marginRight: "8px",
  },
  // такой селектор указан затем, чтобы переписать похожий селектор из global.styles
  ".ant-table-container .ant-table-body": {
    marginRight: "8px",
    paddingBottom: "8px",
    overflowY: "scroll !important",
    // стилизация скролла и спиннера динамической подгрузки
    "&::-webkit-scrollbar-track": {
      marginBottom: "8px",
    },
    [`&:has(div#${LOADING_ON_SCROLL_SPINNER_ID})`]: {
      paddingBottom: "0px",
      "&::-webkit-scrollbar-track": {
        marginBottom: "12px",
      },
    },
  },
  ".ant-table-tbody > tr": {
    [`&:has(div#${LOADING_ON_SCROLL_SPINNER_ID})`]: {
      "&": {
        position: "relative",
        top: "12px",
      },
      "& > td": {
        borderBottom: "none",
      },
    },
  },
};

export const emptyTableStyle = {
  ".ant-table-tbody > tr > td": {
    borderBottom: "none",
  },
  /* для ei ant отдает ширину, данному узлу дом, равную 0 */
  ".ant-table .ant-table-expanded-row-fixed": {
    width: "100% !important",
  },
};

export const transparentBordersStyle = {
  ".ant-table-cell": {
    borderColor: "transparent",
    ...ellipsisStyle,
  } as const,
};

export const getTableStyle = (opacity: TTableOpacity, isWithoutWrapperStyles?: boolean) => {
  const newStyles = isWithoutWrapperStyles ? {} : tableWithPaddingDefaultStyle;

  return {
    ...newStyles,
    opacity,
  };
};

export const getAntTableSpinStyle = (headerHeight: number) => ({
  height: `calc(100vh - ${headerHeight}px)`,
  maxHeight: `calc(100vh - ${headerHeight}px)`,
  minHeight: "150px",
});

// компенсатор серого отступа снизу таблицы. Доводит до макетных 16px
export const tableWrapperStyle = { marginBottom: "7px" };
