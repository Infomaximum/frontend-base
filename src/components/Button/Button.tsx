import React, { memo, useMemo } from "react";
import type { IButtonProps } from "./Button.types";
// eslint-disable-next-line im/ban-import-entity
import { Button as AntButton } from "antd";
import {
  textButtonStyle,
  primaryButtonStyle,
  smallButtonStyle,
  ghostButtonStyle,
  smallOnlyIconStyle,
  defaultButtonStyle,
  primaryDarkButtonStyle,
  ghostDarkButtonStyle,
  primaryNotificationButtonStyle,
  primaryOutlinedButtonStyle,
} from "./Button.styles";
import type { Interpolation } from "@emotion/react";
import { Tooltip } from "../../components/Tooltip/Tooltip";
import { useTheme } from "../../decorators/hooks/useTheme";

const ButtonComponent: React.FC<IButtonProps> = React.forwardRef(
  (props, ref: React.Ref<HTMLButtonElement>) => {
    const { type: typeProps, tooltipPlacement, ...rest } = props;
    const onlyIcon = !props.children;

    const theme = useTheme();

    const buttonStyles = useMemo(() => {
      const styles: Interpolation<TTheme> = [defaultButtonStyle(theme)];

      switch (typeProps) {
        case "primary":
          styles.push(primaryButtonStyle(theme));
          break;
        case "primary-dark":
          styles.push(primaryDarkButtonStyle(theme));
          break;
        case "primary-notification":
          styles.push(primaryNotificationButtonStyle(theme));
          break;
        case "primary-outlined":
          styles.push(primaryOutlinedButtonStyle(theme));
          break;
        case "ghost":
          styles.push(ghostButtonStyle(theme, rest.danger));
          break;
        case "ghost-dark":
          styles.push(ghostDarkButtonStyle(theme));
          break;
        case "text":
          styles.push(textButtonStyle(theme));
          break;
      }

      if (rest.size === "small") {
        if (onlyIcon) {
          styles.push(smallOnlyIconStyle());
        } else {
          styles.push(smallButtonStyle(theme));
        }
      }

      return styles;
    }, [theme, typeProps, rest.size, rest.danger, onlyIcon]);

    const getType = () => {
      switch (typeProps) {
        case "primary-dark":
        case "primary-notification":
        case "primary-outlined":
        case "ghost-dark":
          // primary - используется потому что хорошо кастомизируются стили
          return "primary";
        default:
          return typeProps;
      }
    };

    return (
      <Tooltip title={props.title} placement={tooltipPlacement}>
        <AntButton {...rest} css={buttonStyles} ref={ref} title={undefined} type={getType()} />
      </Tooltip>
    );
  }
);

ButtonComponent.defaultProps = {
  type: "ghost",
};

export const Button = memo(ButtonComponent);
