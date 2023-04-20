import React, { memo, useContext, useState, useMemo, useCallback } from "react";
import type { ITableCellProps, ITableCellFieldFormItemProps } from "./TableCellField.types";
import { FormOption } from "../FormOption/FormOption";
import {
  formItemStyle,
  fieldComponentStyle,
  commonEditableCellStyle,
  ellipsisEditableCellStyle,
} from "./TableCellField.styles";
import type { FieldMetaState, FieldRenderProps } from "react-final-form";
import { hasAutoFocus } from "./TableCellField.utils";
import type { TFieldProvider } from "../FormField/Field/Field.types";
import { useLocalization } from "../../../decorators/hooks/useLocalization";
import { EditableRowContext } from "../../../decorators/contexts/EditableRowContext";
import { EditableTableContext } from "../../../decorators/contexts/EditableTableContext";

export const editableCellClassName = "editable-cell-wrapper";
export const editableCellParentClassName = "editable-cell-wrapper-parent";

const TableCellFieldFormItem = <V, P extends FieldRenderProps<V> = FieldRenderProps<V>>({
  component: FieldComponent,
  ...restProps
}: ITableCellFieldFormItemProps<V, P>) => {
  const localization = useLocalization();
  const [fieldProvider, setFieldProvider] = useState<TFieldProvider<any> | null>(null);

  const meta = fieldProvider?.meta as (FieldMetaState<any> & { form: string }) | undefined;
  const fieldTestId = meta && `${meta.form}_${restProps.name}`;

  return (
    <FormOption formItemStyle={formItemStyle} testId={fieldTestId} {...meta}>
      <FieldComponent
        {...restProps}
        css={fieldComponentStyle}
        setFieldProvider={setFieldProvider}
        localization={localization}
      />
    </FormOption>
  );
};

const TableCellFieldComponent = <V, P extends FieldRenderProps<V> = FieldRenderProps<V>>({
  defaultContent,
  width,
  isNeedEllipsis,
  ...restProps
}: ITableCellProps<V, P>) => {
  const { isEditing } = useContext(EditableRowContext);
  const { focusedFieldNameRef } = useContext(EditableTableContext);

  const wrapperStyle = useMemo(() => [{ maxWidth: width }], [width]);

  const editableCellStyle = useMemo(() => {
    if (isNeedEllipsis) {
      return [commonEditableCellStyle, ellipsisEditableCellStyle];
    }

    return commonEditableCellStyle;
  }, [isNeedEllipsis]);

  const { name, autoFocus } = restProps;

  const handleClick = useCallback(() => {
    if (!isEditing && focusedFieldNameRef) {
      focusedFieldNameRef.current = name;
    }
  }, [name, focusedFieldNameRef, isEditing]);

  return (
    <div className={editableCellParentClassName} css={wrapperStyle} onClick={handleClick}>
      {isEditing ? (
        <TableCellFieldFormItem
          {...restProps}
          autoFocus={hasAutoFocus(name, focusedFieldNameRef?.current ?? null, autoFocus)}
        />
      ) : (
        <div className={editableCellClassName} css={editableCellStyle}>
          {defaultContent}
        </div>
      )}
    </div>
  );
};

export const TableCellField = memo(TableCellFieldComponent);
