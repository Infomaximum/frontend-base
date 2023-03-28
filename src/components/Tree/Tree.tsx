import React, { useMemo } from "react";
import type { ITreeProps } from "./Tree.types";
import { Tree as AntTree } from "antd";
import { treeStyle, treeSwitcherIconContainerStyle, treeSwitcherIconStyle } from "./Tree.styles";
import { DownOutlined } from "../Icons/Icons";
import type { DataNode } from "antd/lib/tree";
import { map } from "lodash";
import { useTheme } from "../../decorators/hooks/useTheme";

/** Метод возвращает новые данные дерева с добавлением classNames для различных состояний */
const mapTreeData = (treeData: DataNode[] | undefined): DataNode[] | undefined => {
  if (!treeData) {
    return;
  }

  return map(treeData, (treeNode) => {
    const nodeClassNames = treeNode.className ? [treeNode.className] : [];

    if (treeNode.disabled) {
      nodeClassNames.push(Tree.DisabledNodeClassName);
    }

    if (!treeNode.selectable) {
      nodeClassNames.push(Tree.UnselectableNodeClassName);
    }

    return {
      ...treeNode,
      children: mapTreeData(treeNode.children),
      className: nodeClassNames.join(" "),
    };
  });
};

const TreeComponent: React.FC<ITreeProps> & {
  getSwitcherIcon: (theme: TTheme) => React.ReactElement;
  DisabledNodeClassName: string;
  UnselectableNodeClassName: string;
} = (props) => {
  const theme = useTheme();
  const treeData = useMemo(() => mapTreeData(props.treeData), [props.treeData]);

  return (
    <AntTree
      switcherIcon={TreeComponent.getSwitcherIcon(theme)}
      {...props}
      treeData={treeData}
      css={treeStyle(theme)}
    />
  );
};

TreeComponent.getSwitcherIcon = (theme: TTheme) => (
  <span css={treeSwitcherIconContainerStyle(theme)}>
    <DownOutlined css={treeSwitcherIconStyle(theme)} />
  </span>
);

TreeComponent.DisabledNodeClassName = "disabled-node-tree";
TreeComponent.UnselectableNodeClassName = "unselectable-node-tree";

export const Tree = TreeComponent;
