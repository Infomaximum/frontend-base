import { memo, type FC } from "react";
import { removeSwitcherFieldButtonTestId } from "@infomaximum/base/src/utils/TestIds";
import type { ISwitcherFieldArrayItemProps } from "./SwitcherFieldArrayItem.types";
import { SwitcherFormField } from "@infomaximum/base/src/components/fields/SwitcherField";
import { RemoveButton } from "../components/RemoveButton/RemoveButton";
import { wrapperStyle } from "../ArrayFieldItems.styles";

const SwitcherFieldArrayItemComponent: FC<ISwitcherFieldArrayItemProps> = (props) => {
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
      <SwitcherFormField
        key={fieldEntityPath}
        name={fieldEntityPath}
        readOnly={readOnly}
        {...rest}
      />
      {isRemoveItem ? (
        <RemoveButton
          fieldEntityIndex={fieldEntityIndex}
          onRemoveFieldEntity={onRemoveFieldEntity}
          testId={`${removeSwitcherFieldButtonTestId}_${fieldEntityIndex}`}
          customRemoveIconStyle={customRemoveIconStyle}
          removeIcon={removeIcon}
        />
      ) : null}
    </div>
  );
};

export const SwitcherFieldArrayItem = memo(SwitcherFieldArrayItemComponent);
