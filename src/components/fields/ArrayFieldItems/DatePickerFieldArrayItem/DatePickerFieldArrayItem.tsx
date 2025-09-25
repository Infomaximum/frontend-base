import type { IDatePickerFieldArrayItemProps } from "./DatePickerFieldArrayItem.types";
import {
  removeDatePickerFieldButtonTestId,
  removeDateTimePickerFieldButtonTestId,
} from "@infomaximum/base/src/utils/TestIds";
import { DatePickerFormField } from "@infomaximum/base/src/components/fields/DatePickerField";
import { RemoveButton } from "../components/RemoveButton/RemoveButton";
import { wrapperFieldStyle, wrapperStyle } from "../ArrayFieldItems.styles";
import { memo } from "react";

const DatePickerFieldArrayItemComponent: React.FC<IDatePickerFieldArrayItemProps> = (props) => {
  const {
    fieldEntityPath,
    fieldEntityIndex,
    onRemoveFieldEntity,
    removeIcon,
    customRemoveIconStyle,
    writeAccess,
    removeAccess,
    readOnly,
    isRemoveItem,
    ...rest
  } = props;

  return (
    <div css={wrapperStyle}>
      <DatePickerFormField
        key={fieldEntityPath}
        name={fieldEntityPath}
        formItemStyle={wrapperFieldStyle}
        wrapperComponentStyle={wrapperFieldStyle}
        readOnly={readOnly}
        {...rest}
      />

      {isRemoveItem ? (
        <RemoveButton
          fieldEntityIndex={fieldEntityIndex}
          onRemoveFieldEntity={onRemoveFieldEntity}
          testId={
            props?.showTime
              ? `${removeDateTimePickerFieldButtonTestId}_${fieldEntityIndex}`
              : `${removeDatePickerFieldButtonTestId}_${fieldEntityIndex}`
          }
          customRemoveIconStyle={customRemoveIconStyle}
          removeIcon={removeIcon}
        />
      ) : null}
    </div>
  );
};

export const DatePickerFieldArrayItem = memo(DatePickerFieldArrayItemComponent);
