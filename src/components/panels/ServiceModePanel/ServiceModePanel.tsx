import React, { memo } from "react";
import type { IServiceModePanelProps } from "./ServiceModePanel.types";
import { useLocalization } from "@infomaximum/base/src/decorators/hooks/useLocalization";
import { SERVICE_MODE } from "@infomaximum/base/src/utils/Localization/Localization";
import { authorizationServiceModePanelTestId } from "@infomaximum/base/src/utils/TestIds";
import { Banner } from "@infomaximum/base/src/components/Banner/Banner";
import { useTheme } from "@infomaximum/base/src/decorators/hooks/useTheme";
import { WarningFilled } from "@infomaximum/base/src/components/Icons/Icons";
import { serviceModeBannerStyle, wrapperContentStyle, iconStyle } from "./ServiceModePanel.styles";

const ServiceModePanelComponent: React.FC<IServiceModePanelProps> = ({ serviceModeMessage }) => {
  const localization = useLocalization();
  const theme = useTheme();

  const content = serviceModeMessage ? serviceModeMessage : localization.getLocalized(SERVICE_MODE);

  const icon = <WarningFilled style={iconStyle} />;

  return (
    <Banner
      content={content}
      showDontShowAgain={false}
      closable={false}
      test-id={authorizationServiceModePanelTestId}
      icon={icon}
      backgroundColor={theme.brandDarkColor}
      css={serviceModeBannerStyle(theme)}
      wrapperContentStyle={wrapperContentStyle}
    />
  );
};

export const ServiceModePanel = memo(ServiceModePanelComponent);
