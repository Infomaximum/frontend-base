import { Popconfirm as AntPopconfirm } from "antd";
import type { IPopconfirmProps } from "./Popconfirm.types";
import { useMemo, type FC } from "react";
import { commonPopconfirmInnerStyle } from "./Popconfirm.styles";

const PopconfirmComponent: FC<IPopconfirmProps> = ({
  children,
  placement,
  overlayInnerStyle: overlayInnerStyleProp,
  ...rest
}) => {
  const overlayInnerStyle = useMemo(
    () => ({
      ...commonPopconfirmInnerStyle,
      ...overlayInnerStyleProp,
    }),
    [overlayInnerStyleProp]
  );

  return (
    <AntPopconfirm
      placement={placement ?? "topLeft"}
      overlayInnerStyle={overlayInnerStyle}
      arrow={{ pointAtCenter: true }}
      {...rest}
    >
      {children}
    </AntPopconfirm>
  );
};

export const Popconfirm = PopconfirmComponent;
