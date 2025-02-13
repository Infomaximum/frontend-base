import type { InputNumberFieldArrayItemProps } from "./InputNumberFieldArrayItem.types";
import React, { memo } from "react";
import { wrapperFieldStyle, wrapperStyle } from "../ArrayFieldItems.styles";
import { removeInputNumberFieldButtonTestId } from "../../../../utils/TestIds";
import { InputNumberFormField } from "../../InputNumberField/InputNumberField";
import { RemoveButton } from "../components/RemoveButton/RemoveButton";

const InputNumberFieldArrayItemComponent: React.FC<InputNumberFieldArrayItemProps> = (props) => {
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
      <InputNumberFormField
        key={fieldEntityPath}
        name={fieldEntityPath}
        wrapperComponentStyle={wrapperFieldStyle}
        readOnly={readOnly}
        {...rest}
      />
      {isRemoveItem && (
        <RemoveButton
          fieldEntityIndex={fieldEntityIndex}
          onRemoveFieldEntity={onRemoveFieldEntity}
          testId={`${removeInputNumberFieldButtonTestId}_${fieldEntityIndex}`}
          customRemoveIconStyle={customRemoveIconStyle}
          removeIcon={removeIcon}
        />
      )}
    </div>
  );
};

export const InputNumberFieldArrayItem = memo(InputNumberFieldArrayItemComponent);
