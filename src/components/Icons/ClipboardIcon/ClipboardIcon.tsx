import { type FC, memo, useCallback } from "react";
import type { IClipboardIconProps } from "./ClipboardIcon.types";
import { iconStyle } from "./ClipboardIcon.styles";
import { Tooltip } from "@infomaximum/base/src/components/Tooltip/Tooltip";
import { useLocalization } from "@infomaximum/base/src/decorators/hooks/useLocalization";
import { COPY } from "@infomaximum/base/src/utils/Localization/Localization";
import copyToClipboard from "copy-to-clipboard";
import { useTheme } from "@infomaximum/base/src/decorators/hooks/useTheme";
import { CopyOutlined } from "../Icons";

const ClipboardIconComponent: FC<IClipboardIconProps> = memo(
  ({ onClick = copyToClipboard, text, ...rest }) => {
    const localization = useLocalization();
    const theme = useTheme();

    const handleClick = useCallback(() => {
      onClick(text);
    }, [onClick, text]);

    return (
      <Tooltip
        destroyTooltipOnHide={true}
        placement={"top"}
        title={localization.getLocalized(COPY)}
      >
        <CopyOutlined {...rest} css={iconStyle(theme)} onClick={handleClick} />
      </Tooltip>
    );
  }
);

export const ClipboardIcon = ClipboardIconComponent;
