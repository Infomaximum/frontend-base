import { type RefObject, useMemo } from "react";
import type { IEditableRowProps, IFormComponentProps } from "./EditableRow.types";
import { tableRowHeightStyle } from "./EditableRow.styles";
import { EditableRowContext } from "../../../decorators/contexts/EditableRowContext";
import { useTheme } from "../../../decorators/hooks/useTheme";
import { Form } from "../../forms/Form/FormWrapper";

export const FormComponent: React.FC<IFormComponentProps> = ({
  children,
  attributes,
  rowProps: { className, ...restRowProps },
}) => {
  return (
    <tr
      {...restRowProps}
      css={tableRowHeightStyle}
      ref={attributes?.ref as RefObject<HTMLTableRowElement>}
    >
      {children}
    </tr>
  );
};

const EditableRowComponent: React.FC<IEditableRowProps> = ({
  children,
  formProps,
  editingState,
  record,
  ...restProps
}) => {
  const isEditing = Boolean(formProps);
  const theme = useTheme();

  const contextValue = useMemo(() => ({ isEditing }), [isEditing]);

  const editableTableRowStyles = useMemo(() => tableRowHeightStyle(theme), [theme]);

  return (
    <EditableRowContext.Provider value={contextValue}>
      {isEditing ? (
        <Form {...formProps} rowProps={restProps} component={FormComponent}>
          {children}
        </Form>
      ) : (
        <tr {...restProps} style={editableTableRowStyles}>
          {children}
        </tr>
      )}
    </EditableRowContext.Provider>
  );
};

const EditableRow = EditableRowComponent;

export { EditableRow };
