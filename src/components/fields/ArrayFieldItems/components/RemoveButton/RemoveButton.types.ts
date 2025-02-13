import type { Interpolation } from "@emotion/react";
import type { ReactElement } from "react";

export interface IRemoveButtonProps {
  testId: string;
  fieldEntityIndex: number;
  customRemoveIconStyle?: Interpolation<TTheme>;
  removeIcon?: ReactElement;
  onRemoveFieldEntity: (index: number) => void;
}
