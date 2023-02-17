import React, { memo, useContext, useMemo } from "react";
import type { IBaseFormProps } from "./BaseForm.types";
import { EFormLayoutType } from "./BaseForm.types";
import {
  formContentWithFooterStyle,
  formContentWithoutFooterStyle,
  formFooterStyle,
  baseFormStyle,
} from "./BaseForm.styles";
import { Layout, Form as AntForm } from "antd";
import { SubmitFormButton } from "../SubmitFormButton/SubmitFormButton";
import { isUndefined, isNull } from "lodash";
import { FormContext } from "../../../decorators/contexts/FormContext";
import { useLocalization } from "../../../decorators/hooks/useLocalization";
import { HeaderMenuPortal } from "../../HeaderMenu/HeaderMenuPortal/HeaderMenuPortal";
import { modalFormLayout, typeLLayout, typeMLayout, typeSLayout } from "../../../styles/formLayout";
import { assertSimple } from "@im/asserts";
import { Notification } from "../../Notification";
import { SAVE } from "../../../utils/Localization/Localization";

const { Footer, Content } = Layout;

const BaseFormComponent: React.FC<IBaseFormProps & { children: React.ReactNode }> = (props) => {
  const {
    error: errorProp,
    submitError,
    layout = "horizontal",
    labelAlign = "left",
    colon = false,
    formStyles,
    showNotification = true,
    layoutType = EFormLayoutType.TypeS,
  } = props;

  const formData = useContext(FormContext);
  const localization = useLocalization();
  const error = errorProp || submitError;

  const defaultHeader = useMemo(() => {
    return (
      <SubmitFormButton
        key="submit-button"
        type="primary-dark"
        size="small"
        caption={localization.getLocalized(SAVE)}
      />
    );
  }, [localization]);

  const footer = useMemo(() => {
    if (!formData.access.hasWriteAccess) {
      return null;
    }

    return <Footer css={props.customFooterStyle ?? formFooterStyle}>{props.footer}</Footer>;
  }, [formData.access.hasWriteAccess, props.customFooterStyle, props.footer]);

  const header = useMemo(() => {
    if (!formData.access.hasWriteAccess) {
      return null;
    }

    if (isUndefined(props.header)) {
      return <HeaderMenuPortal.Body align="right">{defaultHeader}</HeaderMenuPortal.Body>;
    }

    return <HeaderMenuPortal.Body align="right">{props.header}</HeaderMenuPortal.Body>;
  }, [defaultHeader, formData.access.hasWriteAccess, props.header]);

  const { labelCol, notificationCol, wrapperCol } = useMemo(() => {
    switch (layoutType) {
      case EFormLayoutType.TypeS:
        return typeSLayout;
      case EFormLayoutType.TypeM:
        return typeMLayout;
      case EFormLayoutType.TypeL:
        return typeLLayout;
      case EFormLayoutType.ModalType:
        return modalFormLayout;
      default:
        const undefinedLayoutType: never = layoutType;
        assertSimple(false, `Неизвестный тип layout ${undefinedLayoutType}`);
    }
  }, [layoutType]);

  const notification = useMemo(() => {
    if (error && (error.message || error.title)) {
      return showNotification ? (
        <AntForm.Item wrapperCol={props.notificationCol || notificationCol}>
          <Notification error={error} />
        </AntForm.Item>
      ) : null;
    }

    return null;
  }, [error, notificationCol, props.notificationCol, showNotification]);

  return (
    <AntForm
      css={baseFormStyle}
      layout={layout}
      colon={colon}
      labelAlign={labelAlign}
      labelCol={props.labelCol || labelCol}
      wrapperCol={props.wrapperCol || wrapperCol}
    >
      <Content
        css={
          props.footer
            ? [formContentWithFooterStyle, formStyles]
            : [formContentWithoutFooterStyle, formStyles]
        }
      >
        <div {...props.attributes}>
          {notification}
          {props.children}
        </div>
      </Content>
      {!isNull(props.header) ? <HeaderMenuPortal>{header}</HeaderMenuPortal> : null}
      {props.footer ? footer : null}
    </AntForm>
  );
};

export const BaseForm = memo(BaseFormComponent);
