import { forwardRef } from "react";
import { CloseOutlined } from "@im/base/src/components/Icons/Icons";
import {
  closeIconBannerAlertStyle,
  iconBannerAlertStyle,
  wrapperBannerAlertStyle,
  wrapperContentBannerAlertStyle,
} from "./BannerAlert.styles";
import type { IBannerAlertProps } from "./BannerAlert.types";
import { isFunction } from "lodash";
import { crossCloseBannerTestId } from "@im/base/src/utils/TestIds";

const BannerAlert = forwardRef<HTMLDivElement, IBannerAlertProps>((props, ref) => {
  const { children, icon, onClose, backgroundColor, closable, wrapperContentStyle } = props;

  return (
    <div ref={ref} css={[wrapperBannerAlertStyle(backgroundColor), wrapperContentStyle]}>
      <div css={wrapperContentBannerAlertStyle}>
        {icon ? <div css={iconBannerAlertStyle}>{icon}</div> : null}

        {children}
      </div>

      {closable && isFunction(onClose) ? (
        <CloseOutlined
          css={closeIconBannerAlertStyle}
          onClick={onClose}
          test-id={crossCloseBannerTestId}
        />
      ) : null}
    </div>
  );
});

export default BannerAlert;
