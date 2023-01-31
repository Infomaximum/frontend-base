import { Switch as AntSwitch } from "antd";
import type { FC } from "react";
import { memo } from "react";
import { useTheme } from "../../decorators/hooks/useTheme";
import { uncheckedSwitchStyle, checkedSwitchStyle } from "./Switch.styles";
import type { ISwitchProps } from "./Switch.types";

const SwitchComponent: FC<ISwitchProps> = (props) => {
  const theme = useTheme();

  return (
    <AntSwitch
      {...props}
      css={
        props.checked ? checkedSwitchStyle(theme) : uncheckedSwitchStyle(theme)
      }
    />
  );
};

export const Switch = memo(SwitchComponent);
