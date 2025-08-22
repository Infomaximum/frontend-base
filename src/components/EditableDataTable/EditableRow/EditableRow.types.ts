import type { Interpolation } from "@emotion/react";
import type { IBaseFormProps } from "@infomaximum/base/src/components/forms/BaseForm/BaseForm.types";
import type { IFormWrapperProps } from "@infomaximum/base/src/components/forms/Form/FormWrapper.types";
import type { IEditableDataTableState, IEditableRow } from "../EditableDataTable.types";
import type { ITableBodyRowProps } from "@infomaximum/base/src/components/Table/TableComponents/TableBodyRow/TableBodyRow.types";

export interface IFormComponentProps extends IBaseFormProps {
  rowProps: Omit<IEditableRowProps, "formProps" | "children" | "editingState" | "record">;
  children: React.ReactNode;
}

export interface IEditableRowProps extends ITableBodyRowProps {
  formName: string;
  formProps: IFormWrapperProps<IFormComponentProps>;
  editingState?: IEditableDataTableState<IEditableRow>;
  record?: IEditableRow;
  className?: string;
  "data-row-key"?: string;
  onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  style?: React.CSSProperties;
  css?: Interpolation<TTheme>;
  children: React.ReactNode;
}
