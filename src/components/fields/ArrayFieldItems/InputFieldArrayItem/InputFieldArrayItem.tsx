import type { InputFieldArrayItemProps } from "./InputFieldArrayItem.types";
import React, { useCallback } from "react";
import { isFunction } from "lodash";
import { wrapperInputFieldStyle, removeButtonStyle } from "./InputFieldArrayItem.styles";
import { InputFormField } from "../../InputField";
import { Button } from "../../../Button/Button";
import { removeInputFieldButtonTestId } from "../../../../utils/TestIds";
import { CloseOutlined } from "../../../Icons/Icons";

const InputFieldArrayItem: React.FC<InputFieldArrayItemProps> = (props) => {
  const {
    fieldEntityPath,
    fields,
    fieldEntityIndex,
    onRemoveFieldEntity,
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

  return (
    <InputFormField
      key={fieldEntityPath}
      name={fieldEntityPath}
      wrapperComponentStyle={wrapperInputFieldStyle}
      readOnly={readOnly}
      rightLabel={
        fieldsLength && fieldsLength > 1 && !readOnly ? (
          <Button
            type="link"
            size="small"
            test-id={`${removeInputFieldButtonTestId}_${fieldEntityIndex}`}
            value={fieldEntityIndex}
            css={removeButtonStyle}
            onClick={removeField}
          >
            <CloseOutlined />
          </Button>
        ) : null
      }
      {...rest}
    />
  );
};

export { InputFieldArrayItem };
