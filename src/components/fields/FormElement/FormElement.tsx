import React from "react";
import type { IFormElementProps } from "./FormElement.types";

const FormElement: React.FC<IFormElementProps> = ({ children }) => {
  return <>{children}</>;
};

export { FormElement };
