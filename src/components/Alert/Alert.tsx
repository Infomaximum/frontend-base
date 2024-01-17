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
  alertIconStyle,
} from "./Alert.styles";
import type { Interpolation } from "@emotion/react";
import {
  Icon,
  CloseCircleFilled,
  CheckCircleFilled,
  ExclamationCircleFilled,
  InfoCircleFilled,
} from "../../components/Icons/Icons";
import { useTheme } from "../../decorators";

const AlertComponent: React.FC<IAlertProps> = (props) => {
  const theme = useTheme();

  const icon = useMemo(() => {
    let iconComponent: React.FC;

    switch (props.type) {
      case "success":
        iconComponent = CheckCircleFilled;
        break;
      case "warning":
        iconComponent = ExclamationCircleFilled;
        break;
      case "info":
        iconComponent = InfoCircleFilled;
        break;
      case "error":
      default:
        iconComponent = CloseCircleFilled;
    }

    return <Icon component={iconComponent} css={alertIconStyle} />;
  }, [props.type]);

  const customStyle = useMemo(() => {
    const style: Interpolation<TTheme> = [alertStyle(theme)];

    switch (props.type) {
      case "success":
        style.push(successAlertStyle(theme));
        break;
      case "error":
        style.push(errorAlertStyle(theme));
        break;
      case "info":
        style.push(infoAlertStyle(theme));
        break;
      case "warning":
        style.push(warningAlertStyle(theme));
        break;
      default:
        style.push(infoAlertStyle(theme));
    }

    if (props.banner) {
      style.push(alertBannerStyle(theme));
    }

    return style;
  }, [props.type, props.banner, theme]);

  const hasDescription = !!props.description;

  const memoizedMessage = useMemo(
    () =>
      props.message ? <span css={hasDescription && boldTitleStyle}>{props.message}</span> : null,
    [hasDescription, props.message]
  );

  const memoizedDescription = useMemo(
    () =>
      props.description ? (
        <span css={alertDescriptionStyle(theme)}>{props.description}</span>
      ) : null,
    [props.description, theme]
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

export const Alert = React.memo(AlertComponent);
