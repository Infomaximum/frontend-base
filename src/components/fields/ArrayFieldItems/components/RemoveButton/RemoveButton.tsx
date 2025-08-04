import { useCallback, useMemo, type FC } from "react";
import type { IRemoveButtonProps } from "./RemoveButton.types";
import { Button } from "../../../../Button";
import { isFunction } from "lodash";
import { CloseOutlined } from "../../../../Icons";
import { removeButtonDefaultColorsStyle } from "./RemoveButton.styles";
import type { Interpolation, Theme } from "@emotion/react";

export const RemoveButton: FC<IRemoveButtonProps> = (props) => {
  const {
    fieldEntityIndex,
    onRemoveFieldEntity,
    testId,
    customRemoveIconStyle,
    removeIcon: RemoveIcon = <CloseOutlined />,
  } = props;

  const removeField = useCallback(() => {
    if (isFunction(onRemoveFieldEntity)) {
      onRemoveFieldEntity(fieldEntityIndex);
    }
  }, [fieldEntityIndex, onRemoveFieldEntity]);

  const removeButtonStyle = useMemo(() => {
    const styles = [removeButtonDefaultColorsStyle as Interpolation<Theme>];

    if (customRemoveIconStyle) {
      styles.push(customRemoveIconStyle);
    }

    return styles;
  }, [customRemoveIconStyle]);

  return (
    <Button
      type="link"
      size="middle"
      test-id={testId}
      value={fieldEntityIndex}
      css={removeButtonStyle}
      onClick={removeField}
    >
      {RemoveIcon}
    </Button>
  );
};
