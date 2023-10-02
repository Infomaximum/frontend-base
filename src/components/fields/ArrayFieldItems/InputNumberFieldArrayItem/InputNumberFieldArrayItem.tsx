import type { InputNumberFieldArrayItemProps } from "./InputNumberFieldArrayItem.types";
import React, { useCallback, useMemo } from "react";
import { isFunction } from "lodash";
import {
  wrapperInputNumberFieldStyle,
  removeButtonStyle,
} from "./InputNumberFieldArrayItem.styles";
import { Button } from "../../../Button/Button";
import { removeInputNumberFieldButtonTestId } from "../../../../utils/TestIds";
import { CloseOutlined } from "../../../Icons/Icons";
import { InputNumberFormField } from "../../InputNumberField/InputNumberField";

const InputNumberFieldArrayItem: React.FC<InputNumberFieldArrayItemProps> = (props) => {
  const {
    fieldEntityPath,
    fields,
    fieldEntityIndex,
    onRemoveFieldEntity,
    removeIcon: RemoveIcon,
    customRemoveIconStyle,
    writeAccess,
    removeAccess,
    readOnly,
    ...rest
  } = props;

  const fieldsLength = fields?.length;

  const removeField = useCallback(() => {
    if (isFunction(onRemoveFieldEntity)) {
      onRemoveFieldEntity(fieldEntityIndex);
    }
  }, [fieldEntityIndex, onRemoveFieldEntity]);

  const removeButton = useMemo(() => {
    return fieldsLength && fieldsLength > 1 && !readOnly ? (
      <Button
        type="link"
        size="small"
        test-id={`${removeInputNumberFieldButtonTestId}_${fieldEntityIndex}`}
        value={fieldEntityIndex}
        css={customRemoveIconStyle ?? removeButtonStyle}
        onClick={removeField}
      >
        {RemoveIcon ?? <CloseOutlined />}
      </Button>
    ) : null;
  }, [RemoveIcon, fieldEntityIndex, fieldsLength, readOnly, removeField, customRemoveIconStyle]);

  return (
    <InputNumberFormField
      key={fieldEntityPath}
      name={fieldEntityPath}
      wrapperComponentStyle={wrapperInputNumberFieldStyle}
      rightLabel={removeButton}
      readOnly={readOnly}
      {...rest}
    />
  );
};

export { InputNumberFieldArrayItem };
