import { InputNumber as AntInputNumber } from "antd";
import type { FC, Ref, RefAttributes } from "react";
import { forwardRef } from "react";
import { disabledInputStyle } from "./InputNumber.styles";
import type { IInputNumberProps } from "./InputNumber.types";

const InputNumberComponent: FC<
  IInputNumberProps & RefAttributes<HTMLInputElement>
> = forwardRef((props, ref: Ref<HTMLInputElement>) => {
  return (
    <AntInputNumber
      {...props}
      ref={ref}
      css={props.disabled ? disabledInputStyle : undefined}
    />
  );
});

export const InputNumber = InputNumberComponent;
