import React, { useMemo } from "react";
import type { ITreeProps } from "./Tree.types";
import { Tree as AntTree } from "antd";
import {
  treeStyle,
  treeSwitcherIconContainerStyle,
  treeSwitcherIconStyle,
} from "./Tree.styles";
import { DownOutlined } from "src/components/Icons/Icons";
import type { DataNode } from "antd/lib/tree";
import { map } from "lodash";

/** Метод возвращает новые данные дерева с добавлением classNames для различных состояний */
const mapTreeData = (
  treeData: DataNode[] | undefined
): DataNode[] | undefined => {
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

const Tree: React.FC<ITreeProps> & {
  SwitcherIcon: React.ReactElement;
  DisabledNodeClassName: string;
  UnselectableNodeClassName: string;
} = (props) => {
  const treeData = useMemo(() => mapTreeData(props.treeData), [props.treeData]);

  return (
    <AntTree
      switcherIcon={Tree.SwitcherIcon}
      {...props}
      treeData={treeData}
      css={treeStyle}
    />
  );
};

Tree.SwitcherIcon = (
  <span css={treeSwitcherIconContainerStyle}>
    <DownOutlined css={treeSwitcherIconStyle} />
  </span>
);

Tree.DisabledNodeClassName = "disabled-node-tree";
Tree.UnselectableNodeClassName = "unselectable-node-tree";

export default Tree;
