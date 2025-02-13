import { isValidElement } from "react";
import { SYSTEM_FONT } from "./const";

export type TFontSettings = {
  family?: string;
  size: number;
  weight?: number | string;
  defaultTextWidth?: number;
};

export const getTextWidth = (() => {
  const context = document.createElement("canvas").getContext("2d");

  // для тестирования чтобы иметь доступ к контексту
  getWidth.context = context;

  function getWidth(text: string, fontSettings: TFontSettings) {
    const { family = SYSTEM_FONT, size, weight, defaultTextWidth } = fontSettings;

    if (!getWidth.context) {
      return defaultTextWidth ?? 0;
    }

    let font = "";

    if (weight) {
      font += `${weight} `;
    }

    font += `${size}px '${family}'`;

    getWidth.context.font = font;

    return getWidth.context.measureText(text).width;
  }

  return getWidth;
})();

const getTextValueOfReactNode = (node: React.ReactNode): string | undefined => {
  if (["string", "number"].includes(typeof node)) {
    return node?.toString();
  }

  if (node instanceof Array) {
    return node.map(getTextValueOfReactNode).join("");
  }

  if (typeof node === "object" && node && isValidElement(node)) {
    return getTextValueOfReactNode(node.props.children);
  }
};

export const getTextWidthOfReactNode = (node: React.ReactNode, fontSettings: TFontSettings) => {
  const textValueOfReactNode = getTextValueOfReactNode(node);

  return textValueOfReactNode ? getTextWidth(textValueOfReactNode, fontSettings) : undefined;
};
