import type { InputFieldArrayItemProps } from "./InputFieldArrayItem.types";
import React, { memo, useMemo } from "react";
import { InputFormField } from "../../InputField";
import { removeInputFieldButtonTestId } from "../../../../utils/TestIds";
import { RemoveButton } from "../components/RemoveButton/RemoveButton";
import { Space } from "antd";
import type { Interpolation, Theme } from "@emotion/react";
import {
  getFormItemStyle,
  inputGroupStyle,
  wrappedButtonStyle,
} from "./InputFieldArrayItem.styles";

const InputFieldArrayItemComponent: React.FC<InputFieldArrayItemProps> = (props) => {
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

  const isShowRemoveButton = !!isRemoveItem;

  const getRemoveIconStyle = useMemo(() => {
    const defaultStyles = [wrappedButtonStyle as Interpolation<Theme>];

    if (customRemoveIconStyle) {
      defaultStyles.push(customRemoveIconStyle);
    }

    return defaultStyles;
  }, [customRemoveIconStyle]);

  return (
    <Space.Compact style={inputGroupStyle}>
      <InputFormField
        key={fieldEntityPath}
        name={fieldEntityPath}
        formItemStyle={getFormItemStyle(isShowRemoveButton)}
        readOnly={readOnly}
        {...rest}
      />
      {isShowRemoveButton && (
        <RemoveButton
          fieldEntityIndex={fieldEntityIndex}
          onRemoveFieldEntity={onRemoveFieldEntity}
          testId={`${removeInputFieldButtonTestId}_${fieldEntityIndex}`}
          customRemoveIconStyle={getRemoveIconStyle}
          removeIcon={removeIcon}
        />
      )}
    </Space.Compact>
  );
};

export const InputFieldArrayItem = memo(InputFieldArrayItemComponent);
