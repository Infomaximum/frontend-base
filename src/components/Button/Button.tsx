import React, { memo, useMemo } from "react";
import type { IButtonProps } from "./Button.types";
// eslint-disable-next-line im/ban-import-entity
import { Button as AntButton } from "antd";
import {
  defaultButtonStyle,
  outlinedButtonStyle,
  outlinedDarkButtonStyle,
  outlinedPrimaryButtonStyle,
  primaryButtonStyle,
  primaryDarkButtonStyle,
  primaryNotificationButtonStyle,
  textButtonStyle,
  textDarkButtonStyle,
  linkButtonStyle,
  linkDarkButtonStyle,
  smallButtonStyle,
  smallOnlyIconStyle,
  ghostButtonStyle,
  dashedButtonStyle,
  uncertainButtonTypeDisabledStyle,
} from "./Button.styles";
import type { Interpolation } from "@emotion/react";
import { Tooltip } from "../../components/Tooltip/Tooltip";
import { useTheme } from "../../decorators/hooks/useTheme";

const ButtonComponent: React.FC<IButtonProps> = React.forwardRef(
  (props, ref: React.Ref<HTMLButtonElement>) => {
    const {
      type: typeProps = "common",
      ghost,
      dashed,
      tooltipPlacement = "top",
      tooltipAlign,
      ...rest
    } = props;
    const onlyIcon = !props.children;

    const theme = useTheme();

    const buttonStyles = useMemo(() => {
      const styles = [defaultButtonStyle(theme) as Interpolation<TTheme>];

      switch (typeProps) {
        case "common":
          styles.push(outlinedButtonStyle);
          ghost ? styles.push(ghostButtonStyle) : undefined;
          break;
        case "common-dark":
          styles.push(outlinedButtonStyle);
          styles.push(outlinedDarkButtonStyle);
          ghost ? styles.push(ghostButtonStyle) : undefined;
          break;
        case "primary":
          styles.push(primaryButtonStyle);
          break;
        case "primary-dark":
          styles.push(primaryButtonStyle);
          styles.push(primaryDarkButtonStyle);
          break;
        case "primary-notification":
          styles.push(primaryButtonStyle);
          styles.push(primaryNotificationButtonStyle);
          break;
        case "primary-outlined":
          styles.push(outlinedButtonStyle);
          styles.push(outlinedPrimaryButtonStyle);
          break;
        case "text":
          styles.push(textButtonStyle);
          break;
        case "text-dark":
          styles.push(textButtonStyle);
          styles.push(textDarkButtonStyle);
          break;
        case "link":
          styles.push(linkButtonStyle);
          break;
        case "link-dark":
          styles.push(linkButtonStyle);
          styles.push(linkDarkButtonStyle);
          break;
        default:
          styles.push(outlinedButtonStyle);
          styles.push(uncertainButtonTypeDisabledStyle);
          break;
      }

      if (rest.size === "small") {
        if (onlyIcon) {
          styles.push(smallOnlyIconStyle());
        } else {
          styles.push(smallButtonStyle(theme));
        }
      }

      if (dashed) {
        styles.push(dashedButtonStyle);
      }

      return styles;
    }, [theme, typeProps, rest.size, dashed, ghost, onlyIcon]);

    const getType = () => {
      switch (typeProps) {
        case "common":
        case "common-dark":
        case "primary-outlined":
          return "default";
        case "primary-dark":
        case "primary-notification":
          return "primary";
        case "text-dark":
          return "text";
        case "link-dark":
          return "link";
        default:
          return typeProps;
      }
    };

    return (
      <Tooltip title={props.title} placement={tooltipPlacement} align={tooltipAlign}>
        <AntButton {...rest} css={buttonStyles} ref={ref} title={undefined} type={getType()} />
      </Tooltip>
    );
  }
);

export const Button = memo(ButtonComponent);
