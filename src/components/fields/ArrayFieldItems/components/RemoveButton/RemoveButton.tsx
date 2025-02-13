import { useCallback, type FC } from "react";
import type { IRemoveButtonProps } from "./RemoveButton.types";
import { Button } from "../../../../Button";
import { isFunction } from "lodash";
import { CloseOutlined } from "../../../../Icons/Icons";
import { removeButtonStyle } from "./RemoveButton.styles";

export const RemoveButton: FC<IRemoveButtonProps> = (props) => {
  const {
    fieldEntityIndex,
    onRemoveFieldEntity,
    testId,
    customRemoveIconStyle,
    removeIcon: RemoveIcon,
  } = props;

  const removeField = useCallback(() => {
    if (isFunction(onRemoveFieldEntity)) {
      onRemoveFieldEntity(fieldEntityIndex);
    }
  }, [fieldEntityIndex, onRemoveFieldEntity]);

  return (
    <Button
      type="link"
      size="middle"
      test-id={testId}
      value={fieldEntityIndex}
      css={customRemoveIconStyle ?? removeButtonStyle}
      onClick={removeField}
    >
      {RemoveIcon ?? <CloseOutlined />}
    </Button>
  );
};
