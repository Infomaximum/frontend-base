import React, { memo, useContext } from "react";
import type { IActionsFilterButtonProps } from "./ActionsFilterButton.types";
import {
  actionButtonActiveStyle,
  actionButtonStyle,
  iconStyle,
} from "./ActionsFilterButton.styles";
import { BaseDropdownContext } from "../../../Dropdown";
import { Button } from "../../../Button";
import { CaretDownOutlined } from "../../../Icons";
import { dropdownActionsFilterButtonTestId } from "../../../../utils";

const ActionsFilterButton: React.FC<IActionsFilterButtonProps> = React.forwardRef(
  ({ ...rest }, ref: React.Ref<HTMLButtonElement>) => {
    const isShowMenu = useContext(BaseDropdownContext);

    return (
      <Button
        key="button_additional-actions"
        type="text"
        ref={ref}
        css={isShowMenu ? actionButtonActiveStyle : actionButtonStyle}
        test-id={dropdownActionsFilterButtonTestId}
        {...rest}
      >
        <CaretDownOutlined css={iconStyle} />
      </Button>
    );
  }
);

export default memo(ActionsFilterButton);
