import React from "react";
import {
  cardHeaderDefaultStyle,
  cardWrapperDefaultStyle,
  wrapperMenuStyle,
} from "./BaseCard.styles";
import type { Interpolation } from "@emotion/react";
import { isFunction } from "lodash";
import type { IBaseCardProps } from "./BaseCard.types";
import { useTheme } from "../../decorators/hooks/useTheme";

const BaseCardComponent: React.FC<IBaseCardProps> = (props) => {
  const theme = useTheme();
  const { title, styleWrapper, headStyle, bodyStyle, onAnimationEnd, menu } = props;

  const containerDefaultStyle = React.useMemo(
    () => [
      cardWrapperDefaultStyle(theme),
      isFunction(styleWrapper) ? styleWrapper(theme) : styleWrapper,
    ],
    [styleWrapper, theme]
  );

  const headerDefaultStyle = React.useMemo(
    () =>
      [
        cardHeaderDefaultStyle(theme),
        isFunction(headStyle) ? headStyle(theme) : headStyle,
      ] as Interpolation<unknown>,
    [headStyle, theme]
  );

  return (
    <div
      key="card-container"
      css={containerDefaultStyle}
      onAnimationEnd={onAnimationEnd}
      test-id={props["test-id"]}
    >
      {title || menu ? (
        <div key="card-header" css={headerDefaultStyle}>
          {title}
          {menu ? (
            <div key="wrapper-menu" css={wrapperMenuStyle}>
              {menu}
            </div>
          ) : null}
        </div>
      ) : null}

      <div key="card-body" css={bodyStyle}>
        {props.children}
      </div>
    </div>
  );
};

export const BaseCard = React.memo(BaseCardComponent);
