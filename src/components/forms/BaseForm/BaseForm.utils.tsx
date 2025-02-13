import type { ReactNode } from "react";
import React from "react";

export const isValidReactNode = (reactNode: ReactNode) => {
  if (reactNode instanceof Array) {
    return reactNode.some((item: ReactNode): boolean => {
      if (item instanceof Array) {
        return isValidReactNode(item);
      }

      return React.isValidElement(item);
    });
  }

  return React.isValidElement(reactNode);
};
