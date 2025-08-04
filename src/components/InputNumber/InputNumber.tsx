import { InputNumber as AntInputNumber } from "antd";
import type { FC, Ref, RefAttributes } from "react";
import { forwardRef } from "react";
import { disabledInputStyle, inputNumberStyle } from "./InputNumber.styles";
import type { IInputNumberProps } from "./InputNumber.types";

const InputNumberComponent: FC<IInputNumberProps & RefAttributes<HTMLInputElement>> = forwardRef(
  ({ testId, ...rest }, ref: Ref<HTMLInputElement>) => {
    return (
      <AntInputNumber
        {...rest}
        ref={ref}
        css={[rest.disabled && disabledInputStyle, inputNumberStyle]}
        test-id={testId}
      />
    );
  }
);

export const InputNumber = InputNumberComponent;
