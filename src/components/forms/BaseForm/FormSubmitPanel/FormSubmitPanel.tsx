import { memo, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { IFormSubmitPanelProps } from "./FormSubmitPanel.types";
import { Layout } from "antd";
import React from "react";
import { MAIN_LAYOUT_CONTENT_ID } from "../../../../utils";
import { FormContext, useMountEffect } from "../../../../decorators";
import { SubmitFormButton } from "../../SubmitFormButton";
import { CancelChangesFormButton } from "../../CancelChangesFormButton";
import {
  auxiliaryFormSubmitStyle,
  formSubmitButtonStyle,
  getFormSubmitPanelStyle,
} from "./FormSubmitPanel.styles";
import { createPortal } from "react-dom";
import { HeaderMenuPortal } from "../../../HeaderMenu";
import { isUndefined } from "lodash";
import type { Interpolation } from "@emotion/react";

const { Footer } = Layout;

const formSubmitPanelKey = "form-submit-panel-key";

const FormSubmitPanelComponent: React.FC<IFormSubmitPanelProps> = (props) => {
  const { formSubmitPanelConfig } = props;
  const [isPristine, setPristine] = useState(true);
  const [mainLayout, setMainLayout] = useState<Element | null>();
  const formData = useContext(FormContext);
  const formProvider = formData.formProvider;

  useEffect(() => {
    if (formProvider) {
      const unsubscribe = formProvider.subscribe(
        ({ pristine }) => {
          setPristine(pristine);
        },
        {
          pristine: true,
        }
      );

      return unsubscribe;
    }
  }, [formProvider]);

  useMountEffect(() => {
    setMainLayout(document.body.querySelector(`#${MAIN_LAYOUT_CONTENT_ID}`));
  });

  const getFormSubmitPanelContent = useCallback(
    (submitButton?: JSX.Element, auxiliarySubmitStyle?: Interpolation<TTheme>) => (
      <Footer css={auxiliarySubmitStyle ?? getFormSubmitPanelStyle(isPristine)}>
        {submitButton || <SubmitFormButton type="primary" css={formSubmitButtonStyle} />}
        <CancelChangesFormButton />
      </Footer>
    ),
    [isPristine]
  );

  const submitPanel = useMemo(() => {
    if (!formData.access.hasWriteAccess) {
      return null;
    }

    let submitPanelContent = getFormSubmitPanelContent(
      <SubmitFormButton type="primary" css={formSubmitButtonStyle} />
    );

    if (!isUndefined(formSubmitPanelConfig)) {
      if (formSubmitPanelConfig?.isSubmitButtonInHeader) {
        return (
          <HeaderMenuPortal>
            <HeaderMenuPortal.Body align="right">
              {formSubmitPanelConfig.customSubmitButton || <SubmitFormButton size="small" />}
            </HeaderMenuPortal.Body>
          </HeaderMenuPortal>
        );
      }

      if (!isUndefined(formSubmitPanelConfig.customSubmitButton)) {
        submitPanelContent = getFormSubmitPanelContent(formSubmitPanelConfig.customSubmitButton);
      }
    }

    return submitPanelContent;
  }, [formData.access.hasWriteAccess, getFormSubmitPanelContent, formSubmitPanelConfig]);

  return mainLayout
    ? createPortal(submitPanel, mainLayout, formSubmitPanelKey)
    : getFormSubmitPanelContent(
        <SubmitFormButton type="primary" css={formSubmitButtonStyle} />,
        auxiliaryFormSubmitStyle
      );
};

export const FormSubmitPanel = memo(FormSubmitPanelComponent);
