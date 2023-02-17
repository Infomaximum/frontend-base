import { RefObject, useMemo } from "react";
import type { IEditableRowProps, IFormComponentProps } from "./EditableRow.types";
import { tableRowHeight } from "./EditableRow.styles";
import { EditableRowContext } from "../../../decorators/contexts/EditableRowContext";
import { useTheme } from "../../../decorators/hooks/useTheme";
import { Form } from "../../forms/Form/FormWrapper";

const FormComponent: React.FC<IFormComponentProps> = ({
  children,
  attributes,
  rowProps: { className, ...restRowProps },
}) => {
  return (
    <tr
      {...restRowProps}
      css={tableRowHeight}
      ref={attributes?.ref as RefObject<HTMLTableRowElement>}
    >
      {children}
    </tr>
  );
};

const EditableRowComponent: React.FC<IEditableRowProps> = ({
  children,
  formProps,
  ...restProps
}) => {
  const isEditing = Boolean(formProps);
  const theme = useTheme();

  const editableTableRowStyles = useMemo(() => tableRowHeight(theme), [theme]);

  return (
    <EditableRowContext.Provider value={{ isEditing }}>
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
