import React from "react";
import { Button } from "../../../Button";
import { buttonHiddenFiltersStyle, textStyle } from "./HiddenFiltersButton.styles";
import type { IHiddenFiltersButtonProps } from "./HiddenFiltersButton.types";

const HiddenFiltersButton: React.FC<IHiddenFiltersButtonProps> = React.forwardRef(
  (props, ref: React.Ref<HTMLButtonElement>) => {
    const { countFilters, ...rest } = props;

    return (
      <Button
        key="button_show-hidden-filter"
        type="text"
        ref={ref}
        css={buttonHiddenFiltersStyle}
        {...rest}
      >
        <span css={textStyle}>+{countFilters}</span>
      </Button>
    );
  }
);

export default React.memo(HiddenFiltersButton);
