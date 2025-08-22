import { memo, useMemo, type FC } from "react";
import type { IAddButtonProps } from "./AddButton.types";
import { Button } from "@infomaximum/base/src/components/Button/Button";
import { useLocalization } from "@infomaximum/base/src/decorators/hooks/useLocalization";
import { PlusOutlined } from "@infomaximum/base/src/components/Icons/Icons";
import { ADD } from "@infomaximum/base/src/utils/Localization/Localization";
import { addButtonTestId } from "@infomaximum/base/src/utils/TestIds";

const AddButtonComponent: FC<IAddButtonProps> = (props) => {
  const localization = useLocalization();

  const testId = props["test-id"];

  const icon = useMemo(() => <PlusOutlined />, []);

  return (
    <Button
      icon={icon}
      type="primary"
      size="small"
      {...props}
      test-id={testId ? `${addButtonTestId}-${testId}` : addButtonTestId}
    >
      {props.children ?? localization.getLocalized(ADD)}
    </Button>
  );
};

export const AddButton = memo(AddButtonComponent);
