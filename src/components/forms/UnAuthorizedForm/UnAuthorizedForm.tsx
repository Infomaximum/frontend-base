import React, { useMemo } from "react";
import { Layout, Form as AntForm } from "antd";
import { formContentDefaultStyle } from "../BaseForm/BaseForm.styles";
import type { IUnAuthorizedFormProps } from "./UnAuthorizedForm.types";
import { unAuthorizedFormLayout } from "../../../styles/formLayout";
import { Notification } from "../../Notification";

const { Content } = Layout;

const UnAuthorizedForm: React.FC<IUnAuthorizedFormProps> = (props) => {
  const {
    layout = "horizontal",
    formStyles = formContentDefaultStyle,
    showNotification = true,
    originalError,
    children,
    attributes,
  } = props;

  const { notificationCol, wrapperCol } = unAuthorizedFormLayout;

  const notification = useMemo(() => {
    if (originalError?.message) {
      return showNotification ? (
        <AntForm.Item wrapperCol={notificationCol}>
          <Notification error={originalError} />
        </AntForm.Item>
      ) : null;
    }

    return null;
  }, [notificationCol, originalError, showNotification]);

  return (
    <AntForm layout={layout} wrapperCol={wrapperCol}>
      <Content css={formStyles}>
        <div {...attributes}>
          {notification}
          {children}
        </div>
      </Content>
    </AntForm>
  );
};

export { UnAuthorizedForm };
