import { createContext } from "react";

export interface IEditableRowContextData {
  isEditing: boolean;
}

export const EditableRowContext = createContext<IEditableRowContextData>({
  isEditing: false,
});
