import React from "react";
import {
  buttonAddFilterStyle,
  headerIconStyle,
  topPanelFilterStyle,
} from "./AddFilterButton.styles";
import type { IAddFilterButtonProps } from "./AddFilterButton.types";
import { useLocalization } from "@infomaximum/base/src/decorators";
import { Tooltip } from "@infomaximum/base/src/components/Tooltip";
import { Button } from "@infomaximum/base/src/components/Button";
import { FilterFilled, FilterOutlined } from "@infomaximum/base/src/components/Icons";
import { addFilterButtonTestId, FILTER } from "@infomaximum/base/src/utils";

const tooltipAlign = { targetOffset: [0, 2] };

const AddFilterButtonComponent: React.FC<IAddFilterButtonProps> = React.forwardRef(
  (props, ref: React.Ref<HTMLButtonElement>) => {
    const { isHeaderFilter = true, loading, ...rest } = props;
    const localization = useLocalization();

    return (
      <Tooltip align={tooltipAlign} placement="bottom" title={localization.getLocalized(FILTER)}>
        <Button
          key="button_add-filter"
          type={isHeaderFilter ? "text" : "common"}
          ref={ref}
          icon={isHeaderFilter ? <FilterFilled css={headerIconStyle} /> : <FilterOutlined />}
          css={isHeaderFilter ? buttonAddFilterStyle : topPanelFilterStyle}
          test-id={addFilterButtonTestId}
          loading={loading}
          {...rest}
        />
      </Tooltip>
    );
  }
);

export const AddFilterButton = React.memo(AddFilterButtonComponent);
