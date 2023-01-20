import React from "react";
import {
  cardBodyDefault,
  cardHeaderDefault,
  cardWrapperDefault,
  wrapperMenuStyle,
} from "./BaseCard.styles";
import type { Interpolation } from "@emotion/react";
import { isFunction } from "lodash";
import type { IBaseCardProps } from "./BaseCard.types";
import { useTheme } from "@im/base/src/decorators/hooks/useTheme";

const BaseCard: React.FC<IBaseCardProps> = (props) => {
  const theme = useTheme();
  const { title, styleWrapper, headStyle, bodyStyle, onAnimationEnd, menu } = props;

  const containerDefaultStyle = React.useMemo(
    () => [
      cardWrapperDefault(theme),
      isFunction(styleWrapper) ? styleWrapper(theme) : styleWrapper,
    ],
    [styleWrapper, theme]
  );

  const headerDefaultStyle = React.useMemo(
    () =>
      [
        cardHeaderDefault(theme),
        isFunction(headStyle) ? headStyle(theme) : headStyle,
      ] as Interpolation<unknown>,
    [headStyle, theme]
  );

  const bodyDefaultStyle = React.useMemo(
    () => [cardBodyDefault, isFunction(bodyStyle) ? bodyStyle(theme) : bodyStyle],
    [bodyStyle, theme]
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

      <div key="card-body" css={bodyDefaultStyle}>
        {props.children}
      </div>
    </div>
  );
};

export default React.memo(BaseCard);
