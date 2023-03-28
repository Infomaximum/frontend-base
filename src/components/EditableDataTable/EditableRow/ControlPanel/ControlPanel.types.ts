import type { ReactNode } from "react";

export interface IControlPanelProps {
  isEditing: boolean;
  children: ReactNode;
  onCancel(): void;
}
