import { createContext } from "react";

export interface IEditableTableContextData {
  /* Чтобы переопределить автофокус, установив его полю, по которому был произведен клик. */
  focusedFieldNameRef?: React.MutableRefObject<string | null>;
}

export const EditableTableContext = createContext<IEditableTableContextData>({});
