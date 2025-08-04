import React, { memo, useCallback, useContext, useMemo, type ReactNode } from "react";
import { EFormLayoutType, type IBaseFormProps } from "./BaseForm.types";
import {
  formContentWithFooterStyle,
  formContentWithButtonsPanelStyle,
  formFooterStyle,
  formContainerStyle,
  formContentBackgroundStyle,
  getFormDefaultStyle,
  notificationFormItemStyle,
  connectedFormContainerStyle,
} from "./BaseForm.styles";
import { Layout, Form as AntForm } from "antd";
import { FormContext } from "../../../decorators/contexts/FormContext";
import { Notification } from "../../Notification";
import { ESpaceSize, SpaceSizeContext } from "../../../decorators/contexts/SpaceSizeContext";
import type { Interpolation } from "@emotion/react";
import { forEach, isArray } from "lodash";
import { FormSubgroup } from "../FormSubgroup/FormSubgroup";
import { FormFooterPanel } from "./FormFooterPanel/FormFooterPanel";
import { isValidReactNode } from "./BaseForm.utils";
import { FORM_WRAPPER_ID } from "../../../utils";

const { Footer, Content } = Layout;

const getSpaceSizeContextValue = (layoutType?: EFormLayoutType) => {
  switch (layoutType) {
    case EFormLayoutType.LargeType:
      return ESpaceSize.large;
    case EFormLayoutType.TableType:
      return ESpaceSize.table;
    case EFormLayoutType.ModalType:
      return ESpaceSize.modal;
    case EFormLayoutType.ModalExtensiveType:
      return ESpaceSize.modal;
    default:
      return ESpaceSize.default;
  }
};

const BaseFormComponent: React.FC<IBaseFormProps & { children: React.ReactNode }> = (props) => {
  const {
    component,
    error: errorProp,
    submitError,
    layout = "vertical",
    labelAlign = "left",
    colon = false,
    formStyles,
    showNotification = true,
    layoutType,
    handleScrollContent,
    formFooterPanelConfig,
    connectedFormStyles,
  } = props;

  const formData = useContext(FormContext);
  const error = errorProp || submitError;

  const customFooter = useMemo(() => {
    if (!formData.access.hasWriteAccess) {
      return null;
    }

    return <Footer css={props.customFooterStyle ?? formFooterStyle}>{props.footer}</Footer>;
  }, [formData.access.hasWriteAccess, props.customFooterStyle, props.footer]);

  const notification = useMemo(() => {
    if (error && (error.message || error.title)) {
      return showNotification ? (
        <AntForm.Item css={notificationFormItemStyle}>
          <Notification error={error} />
        </AntForm.Item>
      ) : null;
    }

    return null;
  }, [error, showNotification]);

  const formContentStyles = useMemo(() => {
    const styles: Interpolation<TTheme>[] = [formContentBackgroundStyle];

    props.footer
      ? styles.push(formContentWithFooterStyle)
      : styles.push(formContentWithButtonsPanelStyle);

    styles.push(formStyles);

    return styles;
  }, [formStyles, props.footer]);

  const getWrappedFormSubgroup = useCallback(
    (element: ReactNode, key: number | string, subgroupFooter?: JSX.Element) =>
      isValidReactNode(element) && (
        <Content
          key={`form-subgroup-${key}`}
          css={formContentStyles}
          onScroll={handleScrollContent}
        >
          <div>
            <SpaceSizeContext.Provider value={getSpaceSizeContextValue(layoutType)}>
              {element}
            </SpaceSizeContext.Provider>
          </div>
          {subgroupFooter}
        </Content>
      ),
    [formContentStyles, handleScrollContent, layoutType]
  );

  const getWrappedMainSubgroup = useCallback(
    (element: ReactNode) => {
      const mainSubgroupFunctionButtonsFooter = (
        <FormFooterPanel
          formFooterPanelConfig={formFooterPanelConfig ?? {}}
          layoutType={layoutType}
        />
      );

      return getWrappedFormSubgroup(
        element,
        "main",
        props.footer ? undefined : mainSubgroupFunctionButtonsFooter
      );
    },
    [formFooterPanelConfig, getWrappedFormSubgroup, layoutType, props.footer]
  );

  const formContent = useMemo(() => {
    const childrenArray = React.Children.toArray(props.children);
    const mainContentSubgroup: ReactNode[] = [];
    const modalsSubgroup: ReactNode[] = [];
    const contentSubgroups: ReactNode[] = [];

    const distributeElements = (children: ReactNode) => {
      if (React.isValidElement(children)) {
        if (children.key?.includes("modal")) {
          modalsSubgroup.push(children);
        } else {
          if (children.type === FormSubgroup) {
            contentSubgroups.push(children);
          } else if (children.type === React.Fragment) {
            distributeElements(children.props?.children);
          } else {
            mainContentSubgroup.push(children);
          }
        }
      } else {
        if (isArray(children)) {
          forEach(children, (node) => {
            distributeElements(node);
          });
        } else {
          mainContentSubgroup.push(children);
        }
      }
    };

    forEach(childrenArray, (node) => {
      distributeElements(node);
    });

    if (mainContentSubgroup.length > 0) {
      if (layoutType === EFormLayoutType.ModalType) {
        mainContentSubgroup.unshift(notification);
      } else {
        mainContentSubgroup.push(notification);
      }

      contentSubgroups.push(
        <FormSubgroup priority={0} key="main">
          {mainContentSubgroup}
        </FormSubgroup>
      );
    }

    const sortedContentSubgroups = contentSubgroups
      .sort((prev, curr) => {
        if (React.isValidElement(prev) && React.isValidElement(curr)) {
          return (prev.props.priority ?? 1) > (curr.props.priority ?? 1) ? -1 : 1;
        }

        return 0;
      })
      .map((subgroup, index) => {
        if (React.isValidElement(subgroup) && subgroup.key === "main") {
          return getWrappedMainSubgroup(subgroup);
        }

        return getWrappedFormSubgroup(subgroup, index);
      });

    return [sortedContentSubgroups, modalsSubgroup];
  }, [props.children, layoutType, notification, getWrappedFormSubgroup, getWrappedMainSubgroup]);

  return (
    <div id={FORM_WRAPPER_ID} css={formContainerStyle}>
      <AntForm
        component={component}
        css={getFormDefaultStyle(layoutType)}
        layout={layout}
        colon={colon}
        labelAlign={labelAlign}
      >
        <div {...props.attributes} css={[connectedFormContainerStyle, connectedFormStyles]}>
          {formContent}
          {props.footer && customFooter}
        </div>
      </AntForm>
    </div>
  );
};

export const BaseForm = memo(BaseFormComponent);
