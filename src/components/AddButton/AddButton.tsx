import { memo, useMemo, FC } from "react";
import type { IAddButtonProps } from "./AddButton.types";
import Button from "src/components/Button/Button";
import { useLocalization } from "src/decorators/hooks/useLocalization";
import Icon from "src/components/Icons/Icons";
import PlusSVG from "src/resources/icons/Plus.svg";
import { ADD } from "src/utils/Localization/Localization";
import { addButtonTestId } from "src/utils/TestIds";

const AddButton: FC<IAddButtonProps> = (props) => {
  const localization = useLocalization();

  const testId = props["test-id"];

  const icon = useMemo(() => <Icon key="plus" component={PlusSVG} />, []);

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

export default memo(AddButton);
