import React, { useMemo } from "react";
import { Alert as AntAlert } from "antd";
import type { IAlertProps } from "./Alert.types";
import {
  infoAlertStyle,
  warningAlertStyle,
  errorAlertStyle,
  successAlertStyle,
  boldTitleStyle,
  alertDescriptionStyle,
  alertStyle,
  alertBannerStyle,
} from "./Alert.styles";
import type { Interpolation } from "@emotion/react";
import Icon, {
  CloseCircleFilled,
  CheckCircleFilled,
  ExclamationCircleFilled,
} from "src/components/Icons/Icons";

const Alert: React.FC<IAlertProps> = (props) => {
  const icon = useMemo(() => {
    let iconComponent: React.FC;
    switch (props.type) {
      case "success":
        iconComponent = CheckCircleFilled;
        break;
      case "warning":
        iconComponent = ExclamationCircleFilled;
        break;
      case "error":
      case "info":
      default:
        iconComponent = CloseCircleFilled;
    }
    return <Icon component={iconComponent} />;
  }, [props.type]);

  const customStyle = useMemo(() => {
    const style: Interpolation<TTheme> = [alertStyle];
    switch (props.type) {
      case "success":
        style.push(successAlertStyle);
        break;
      case "error":
        style.push(errorAlertStyle);
        break;
      case "info":
        style.push(infoAlertStyle);
        break;
      case "warning":
        style.push(warningAlertStyle);
        break;
      default:
        style.push(infoAlertStyle);
    }

    if (props.banner) {
      style.push(alertBannerStyle);
    }

    return style;
  }, [props.type, props.banner]);

  const hasDescription = !!props.description;

  const memoizedMessage = useMemo(
    () =>
      props.message ? (
        <span css={hasDescription && boldTitleStyle}>{props.message}</span>
      ) : null,
    [hasDescription, props.message]
  );

  const memoizedDescription = useMemo(
    () =>
      props.description ? (
        <span css={alertDescriptionStyle}>{props.description}</span>
      ) : null,
    [props.description]
  );

  return (
    <AntAlert
      {...props}
      css={customStyle}
      icon={icon}
      message={memoizedMessage}
      description={memoizedDescription}
    />
  );
};

export default React.memo(Alert);
