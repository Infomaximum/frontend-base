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
} from "./Button.styles";
import type { Interpolation } from "@emotion/react";
import { Tooltip } from "../../components/Tooltip/Tooltip";

const ButtonComponent: React.FC<IButtonProps> = React.forwardRef(
  (props, ref: React.Ref<HTMLButtonElement>) => {
    const { type: typeProps, ...rest } = props;
    const onlyIcon = !props.children;

    const buttonStyles = useMemo(() => {
      const styles: Interpolation<TTheme> = [defaultButtonStyle];

      switch (typeProps) {
        case "primary":
          styles.push(primaryButtonStyle);
          break;
        case "primary-dark":
          styles.push(primaryDarkButtonStyle);
          break;
        case "primary-notification":
          styles.push(primaryNotificationButtonStyle);
          break;
        case "ghost":
          styles.push(ghostButtonStyle);
          break;
        case "ghost-dark":
          styles.push(ghostDarkButtonStyle);
          break;
        case "text":
          styles.push(textButtonStyle);
          break;
      }

      if (rest.size === "small") {
        if (onlyIcon) {
          styles.push(smallOnlyIconStyle);
        } else {
          styles.push(smallButtonStyle);
        }
      }

      return styles;
    }, [typeProps, rest.size, onlyIcon]);

    const getType = () => {
      switch (typeProps) {
        case "primary-dark":
        case "primary-notification":
        case "ghost-dark":
          // primary - используется потому что хорошо кастомизируются стили
          return "primary";
        default:
          return typeProps;
      }
    };

    return (
      <Tooltip title={props.title}>
        <AntButton
          {...rest}
          css={buttonStyles}
          ref={ref}
          title={undefined}
          type={getType()}
        />
      </Tooltip>
    );
  }
);

ButtonComponent.defaultProps = {
  type: "ghost",
};

export const Button = memo(ButtonComponent);
