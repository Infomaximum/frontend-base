import React from "react";
import { buttonAddFilterStyle, topPanelFilterStyle } from "./AddFilterButton.styles";
import type { IAddFilterButtonProps } from "./AddFilterButton.types";
import { useLocalization } from "../../../../decorators";
import { Tooltip } from "../../../Tooltip";
import { Button } from "../../../Button";
import { AddFilterSVG } from "../../../../resources";
import { FilterOutlined } from "../../../Icons";
import { addFilterButtonTestId, FILTER } from "../../../../utils";

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
          icon={isHeaderFilter ? <AddFilterSVG /> : <FilterOutlined />}
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
