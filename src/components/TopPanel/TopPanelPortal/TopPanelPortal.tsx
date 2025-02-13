import React, { useContext } from "react";
import ReactDOM from "react-dom";
import { TopPanelContext } from "../../../decorators/contexts/TopPanelContext";

const TopPanelPortalComponent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const topPanelContainer = useContext(TopPanelContext);

  return topPanelContainer
    ? ReactDOM.createPortal(<>{children ? children : null}</>, topPanelContainer)
    : null;
};

export const TopPanelPortal = TopPanelPortalComponent;
