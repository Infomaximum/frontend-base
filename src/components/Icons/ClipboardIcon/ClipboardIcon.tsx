import { FC, memo, useCallback } from "react";
import { CopyOutlined } from "../Icons";
import type { IClipboardIconProps } from "./ClipboardIcon.types";
import { iconStyle, tooltipStyle } from "./ClipboardIcon.styles";
import { Tooltip } from "../../Tooltip/Tooltip";
import { useLocalization } from "../../../decorators/hooks/useLocalization";
import { COPY_TO_CLIPBOARD } from "../../../utils/Localization/Localization";
import copyToClipboard from "copy-to-clipboard";

const ClipboardIconComponent: FC<IClipboardIconProps> = memo(
  ({ onClick = copyToClipboard, text, ...rest }) => {
    const localization = useLocalization();

    const handleClick = useCallback(() => {
      onClick(text);
    }, [onClick, text]);

    return (
      <Tooltip
        css={tooltipStyle}
        title={localization.getLocalized(COPY_TO_CLIPBOARD)}
      >
        <CopyOutlined {...rest} css={iconStyle} onClick={handleClick} />
      </Tooltip>
    );
  }
);

export const ClipboardIcon = ClipboardIconComponent;
