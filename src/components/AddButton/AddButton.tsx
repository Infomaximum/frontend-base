import { memo, useMemo, type FC } from "react";
import type { IAddButtonProps } from "./AddButton.types";
import { Button } from "../../components/Button/Button";
import { useLocalization } from "../../decorators/hooks/useLocalization";
import { Icon } from "../../components/Icons/Icons";
import PlusSVG from "../../resources/icons/Plus.svg";
import { ADD } from "../../utils/Localization/Localization";
import { addButtonTestId } from "../../utils/TestIds";

const AddButtonComponent: FC<IAddButtonProps> = (props) => {
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

export const AddButton = memo(AddButtonComponent);
