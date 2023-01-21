import React, { memo } from "react";
import type { IServiceModePanelProps } from "./ServiceModePanel.types";
import { useLocalization } from "@im/base/src/decorators/hooks/useLocalization";
import { SERVICE_MODE } from "@im/base/src/utils/Localization/Localization";
import { authorizationServiceModePanelTestId } from "@im/base/src/utils/TestIds";
import Banner from "@im/base/src/components/Banner/Banner";
import { useTheme } from "@im/base/src/decorators/hooks/useTheme";
import { WarningOutlined } from "@im/base/src/components/Icons/Icons";
import { serviceModeBannerStyle, wrapperContentStyle, iconStyle } from "./ServiceModePanel.styles";

const ServiceModePanel: React.FC<IServiceModePanelProps> = ({ serviceModeMessage }) => {
  const localization = useLocalization();
  const theme = useTheme();

  const content = serviceModeMessage ? serviceModeMessage : localization.getLocalized(SERVICE_MODE);

  const icon = <WarningOutlined style={iconStyle} />;

  return (
    <Banner
      content={content}
      showDontShowAgain={false}
      closable={false}
      test-id={authorizationServiceModePanelTestId}
      icon={icon}
      backgroundColor={theme.brandDarkColor}
      css={serviceModeBannerStyle}
      wrapperContentStyle={wrapperContentStyle}
    />
  );
};

export default memo(ServiceModePanel);
