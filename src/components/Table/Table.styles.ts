import { ellipsisStyle } from "@im/base/src/styles/common.styles";

export const borderTopStyle = (theme: TTheme) =>
  ({
    borderBottom: `1px solid ${theme.grey4Color}`,
    height: "0",
  } as const);

export const emptyTableStyle = () => ({
  ".ant-table-tbody > tr > td": {
    borderBottom: "none",
  },
  /* для ei ant отдает ширину, данному узлу дом, равную 0 */
  ".ant-table .ant-table-expanded-row-fixed": {
    width: "100% !important",
  },
});

export const transparentBordersStyle = {
  ".ant-table-cell": {
    borderColor: "transparent",
    ...ellipsisStyle,
  } as const,
};
