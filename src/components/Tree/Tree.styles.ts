import { HoverAnimationInterval } from "@im/base/src/utils/const";
import Tree from "./Tree";

export const treeSwitcherIconContainerStyle = (theme: TTheme) =>
  ({
    width: "100%",
    height: "100%",
    lineHeight: "32px",
    transition: `background ${HoverAnimationInterval}ms`,
    "&:hover": {
      background: theme.grey3Color,
    },
  } as const);

export const treeSwitcherIconStyle = (theme: TTheme) =>
  ({
    fontSize: `${theme.h5FontSize}px !important`,
    color: theme.grey7Color,
  } as const);

export const treeStyle = (theme: TTheme) => ({
  padding: 0,
  fontSize: "13px",
  ".ant-tree-node-content-wrapper": {
    borderRadius: 0,
    padding: "4px",
  },
  ".ant-tree-treenode": {
    padding: 0,
  },
  ".ant-tree-node-content-wrapper.ant-tree-node-selected": {
    backgroundColor: theme.blue1Color,
  },
  [`.${Tree.DisabledNodeClassName}`]: {
    ".ant-tree-node-content-wrapper": {
      color: theme.grey7Color,
    },
  },
  [`.${Tree.UnselectableNodeClassName}`]: {
    ".ant-tree-node-content-wrapper": {
      cursor: "default",
      background: "initial",
    },
  },
});
