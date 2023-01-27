import { Switch as AntSwitch } from "antd";
import type { FC } from "react";
import { memo } from "react";
import { uncheckedSwitchStyle, checkedSwitchStyle } from "./Switch.styles";
import type { ISwitchProps } from "./Switch.types";

const SwitchComponent: FC<ISwitchProps> = (props) => {
  return (
    <AntSwitch
      {...props}
      css={props.checked ? checkedSwitchStyle : uncheckedSwitchStyle}
    />
  );
};

export const Switch = memo(SwitchComponent);
