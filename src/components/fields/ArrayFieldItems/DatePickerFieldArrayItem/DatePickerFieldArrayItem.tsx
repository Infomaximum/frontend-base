import type { IDatePickerFieldArrayItemProps } from "./DatePickerFieldArrayItem.types";
import React, { useCallback, useMemo } from "react";
import { isFunction } from "lodash";
import { datePickerStyle, removeButtonStyle } from "./DatePickerFieldArrayItem.styles";
import {
  removeDatePickerFieldButtonTestId,
  removeDateTimePickerFieldButtonTestId,
} from "../../../../utils/TestIds";
import { Button } from "../../../Button/Button";
import { CloseOutlined } from "../../../Icons/Icons";
import { DatePickerFormField } from "../../DatePickerField";

const DatePickerFieldArrayItem: React.FC<IDatePickerFieldArrayItemProps> = (props) => {
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

  const removeButton = useMemo(() => {
    return fieldsLength && fieldsLength > 1 && !readOnly ? (
      <Button
        type="link"
        size="small"
        test-id={
          props?.showTime
            ? `${removeDateTimePickerFieldButtonTestId}_${fieldEntityIndex}`
            : `${removeDatePickerFieldButtonTestId}_${fieldEntityIndex}`
        }
        value={fieldEntityIndex}
        css={removeButtonStyle}
        onClick={removeField}
      >
        <CloseOutlined />
      </Button>
    ) : null;
  }, [fieldEntityIndex, fieldsLength, props?.showTime, readOnly, removeField]);

  return (
    <DatePickerFormField
      key={fieldEntityPath}
      name={fieldEntityPath}
      css={datePickerStyle}
      wrapperComponentStyle={datePickerStyle}
      rightLabel={removeButton}
      readOnly={readOnly}
      {...rest}
    />
  );
};

export { DatePickerFieldArrayItem };
