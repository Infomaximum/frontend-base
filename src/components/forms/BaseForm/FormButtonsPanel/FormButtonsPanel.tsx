import { Fragment } from "react";
import { memo, useMemo } from "react";
import type { IFormButtonsPanelProps } from "./FormButtonsPanel.types";
import { forEach, isNull, map } from "lodash";
import { sortByPriority } from "../../../../utils/Routes/routes";
import { getFormButtonsPanelStyle } from "./FormButtonsPanel.styles";
import { useFeature } from "../../../../decorators";
import { isShowElement } from "../../../../utils";

const FormButtonsPanelComponent: React.FC<IFormButtonsPanelProps> = (props) => {
  const { formButtonsConfig } = props;
  const { isFeatureEnabled } = useFeature();
  const buttons = useMemo(() => {
    const sortedButtons: React.ReactElement[] = [];

    forEach(sortByPriority(formButtonsConfig.formButtonObjects), (buttonObject, index) => {
      if (buttonObject) {
        const { component, accessRules } = buttonObject;

        if (component && isShowElement(accessRules, isFeatureEnabled)) {
          if (isNull(component.key)) {
            sortedButtons.push(<Fragment key={index}>{component}</Fragment>);
          } else {
            sortedButtons.push(component);
          }
        }
      }
    });

    return map(sortedButtons, (buttonComponent) => buttonComponent);
  }, [formButtonsConfig.formButtonObjects, isFeatureEnabled]);

  return (
    buttons.length !== 0 && (
      <div css={getFormButtonsPanelStyle(formButtonsConfig.buttonsAlign)}>{buttons}</div>
    )
  );
};

export const FormButtonsPanel = memo(FormButtonsPanelComponent);
