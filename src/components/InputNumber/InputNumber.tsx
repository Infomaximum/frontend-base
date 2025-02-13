import { InputNumber as AntInputNumber } from "antd";
import type { FC, Ref, RefAttributes } from "react";
import { forwardRef } from "react";
import { disabledInputStyle, inputNumberStyle } from "./InputNumber.styles";
import type { IInputNumberProps } from "./InputNumber.types";

const InputNumberComponent: FC<IInputNumberProps & RefAttributes<HTMLInputElement>> = forwardRef(
  (props, ref: Ref<HTMLInputElement>) => {
    return (
      <AntInputNumber
        {...props}
        ref={ref}
        css={[props.disabled && disabledInputStyle, inputNumberStyle]}
      />
    );
  }
);

export const InputNumber = InputNumberComponent;
