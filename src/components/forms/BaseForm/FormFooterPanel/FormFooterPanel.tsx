import { Fragment, memo, useCallback, useContext, useMemo } from "react";
import { Layout } from "antd";
import React from "react";
import { isShowElement, sortByPriority } from "@infomaximum/base/src/utils";
import { FormContext } from "@infomaximum/base/src/decorators/contexts/FormContext";
import { useFeature } from "@infomaximum/base/src/decorators/hooks/useFeature";
import { SubmitFormButton } from "@infomaximum/base/src/components/forms/SubmitFormButton";
import { CancelChangesFormButton } from "@infomaximum/base/src/components/forms/CancelChangesFormButton";
import {
  getFormFooterStyle,
  formFunctionalButtonsContainerStyle,
  formSubmitButtonStyle,
  submitButtonsStyle,
} from "./FormFooterPanel.styles";
import { HeaderMenuPortal } from "@infomaximum/base/src/components/HeaderMenu";
import { forEach, isNull, isUndefined, map } from "lodash";
import type { IFormFooterPanelProps } from "./FormFooterPanel.types";

const { Footer } = Layout;

const FormFooterPanelComponent: React.FC<IFormFooterPanelProps> = (props) => {
  const {
    formFooterPanelConfig: { formSubmitButtons, formFunctionalButtons },
    layoutType,
  } = props;
  const { isFeatureEnabled } = useFeature();
  const formData = useContext(FormContext);

  const functionalButtons = useMemo(() => {
    if (isUndefined(formFunctionalButtons)) {
      return null;
    }

    const sortedButtons: React.ReactElement[] = [];

    forEach(sortByPriority(formFunctionalButtons), (buttonObject, index) => {
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

    return sortedButtons.length !== 0 ? (
      <div css={formFunctionalButtonsContainerStyle}>
        {map(sortedButtons, (buttonComponent) => buttonComponent)}
      </div>
    ) : null;
  }, [formFunctionalButtons, isFeatureEnabled]);

  const getFormSubmitButtons = useCallback(
    (submitButton?: JSX.Element) => (
      <div css={submitButtonsStyle}>
        {submitButton || (
          <SubmitFormButton
            disabled={formSubmitButtons?.isSubmitButtonDisabled}
            type="primary"
            css={formSubmitButtonStyle}
          />
        )}
        <CancelChangesFormButton />
      </div>
    ),
    [formSubmitButtons?.isSubmitButtonDisabled]
  );

  const footerPanel = useMemo(() => {
    if (!formData.access.hasWriteAccess || isNull(formSubmitButtons)) {
      return !isNull(functionalButtons) ? (
        <Footer css={getFormFooterStyle(layoutType)}>
          <div>{functionalButtons}</div>
        </Footer>
      ) : null;
    }

    let submitButtons = getFormSubmitButtons();

    if (!isUndefined(formSubmitButtons)) {
      if (formSubmitButtons?.isSubmitButtonInHeader) {
        return (
          <HeaderMenuPortal>
            <HeaderMenuPortal.Body align="right">
              {formSubmitButtons.customSubmitButton || <SubmitFormButton size="small" />}
            </HeaderMenuPortal.Body>
          </HeaderMenuPortal>
        );
      }

      if (!isUndefined(formSubmitButtons?.customSubmitButton)) {
        submitButtons = getFormSubmitButtons(formSubmitButtons.customSubmitButton);
      }
    }

    return (
      <Footer css={getFormFooterStyle(layoutType)}>
        <div>
          {submitButtons}
          {functionalButtons}
        </div>
      </Footer>
    );
  }, [
    formData.access.hasWriteAccess,
    formSubmitButtons,
    getFormSubmitButtons,
    layoutType,
    functionalButtons,
  ]);

  return footerPanel;
};

export const FormFooterPanel = memo(FormFooterPanelComponent);
