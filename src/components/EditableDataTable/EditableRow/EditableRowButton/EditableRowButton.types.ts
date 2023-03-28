import type { EEditableRowButtonTypes } from "./EditableRowButton";

export interface IEditableRowButtonProps<T = any> {
  type?: EEditableRowButtonTypes;
  clickHandlerData?: T;
  onClick(data: T): void;
  disabled?: boolean;
  children: React.ReactNode;
}
