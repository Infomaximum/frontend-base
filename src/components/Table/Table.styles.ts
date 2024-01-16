import { ellipsisStyle } from "../../styles/common.styles";
import type { TTableOpacity } from "./Table.types";

export const borderTopStyle = (theme: TTheme) =>
  ({
    borderBottom: `1px solid ${theme.grey4Color}`,
    height: "0",
  } as const);

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

export const tableStyle = (opacity: TTableOpacity) => ({ opacity });

export const antTableSpinStyle = (headerHeight: number) => ({
  height: `calc(100vh - ${headerHeight}px)`,
  minHeight: "150px",
});
