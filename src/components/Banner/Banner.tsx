import { useCallback, useMemo, useState, FC } from "react";
import { useLocalization } from "@im/base/src/decorators/hooks/useLocalization";
import Checkbox from "@im/base/src/components/Checkbox/Checkbox";
import type { IBannerProps } from "./Banner.types";
import BannerContent from "./components/BannerContent/BannerContent";
import Button from "@im/base/src/components/Button/Button";
import { DONT_SHOW_AGAIN, CLOSE } from "@im/base/src/utils/Localization/Localization";
import {
  bannerStyle,
  dontShowAgainWrapperBannerStyle,
  dontShowAgainCheckboxBannerStyle,
  animationBannerStyle,
  closeBannerAnimationDuration,
} from "./Banner.styles";
import BannerAlert from "./components/BannerAlert/BannerAlert";
import { isFunction } from "lodash";
import { MillisecondsPerSecond } from "@im/utils";
import { bannerDontShowAgainTestId, closeBannerButtonTestId } from "@im/base/src/utils/TestIds";
import type { CheckboxChangeEvent } from "antd/lib/checkbox";

const Banner: FC<IBannerProps> = ({
  showDontShowAgain,
  content,
  onClose,
  setDontShowAgain,
  ["test-id"]: testId,
  backgroundColor,
  className,
  icon,
  closable,
  wrapperContentStyle,
}) => {
  const localization = useLocalization();
  const [isVisible, setVisible] = useState(true);
  const [isStartAnimation, setStartAnimation] = useState(false);

  /** Обработчик клика по кнопке "Закрыть" */
  const handleCloseButtonClick = useCallback(() => {
    setStartAnimation(true);

    if (isFunction(onClose)) {
      onClose();
    }

    setTimeout(() => {
      setVisible(false);
      setStartAnimation(false);
      // отмонтируем после того как анимация закончилась
    }, closeBannerAnimationDuration * MillisecondsPerSecond);
  }, [onClose]);

  /** Обработчик клика по чекбоксу "Больше не показывать" */
  const handleDontShowAgainChange = useCallback(
    (event: CheckboxChangeEvent) => {
      if (showDontShowAgain && isFunction(setDontShowAgain)) {
        setDontShowAgain(event.target.checked);
      }
    },
    [setDontShowAgain, showDontShowAgain]
  );

  /** Контент уведомления */
  const alertContent = useMemo(() => {
    return content ? (
      <div>
        <BannerContent md={content} backgroundColor={backgroundColor} />
        {showDontShowAgain ? (
          <div css={dontShowAgainWrapperBannerStyle}>
            <Button
              onClick={handleCloseButtonClick}
              type="primary-notification"
              test-id={closeBannerButtonTestId}
            >
              {localization.getLocalized(CLOSE)}
            </Button>
            <Checkbox
              onChange={handleDontShowAgainChange}
              css={dontShowAgainCheckboxBannerStyle}
              test-id={bannerDontShowAgainTestId}
            >
              {localization.getLocalized(DONT_SHOW_AGAIN)}
            </Checkbox>
          </div>
        ) : null}
      </div>
    ) : null;
  }, [
    content,
    backgroundColor,
    showDontShowAgain,
    handleCloseButtonClick,
    localization,
    handleDontShowAgainChange,
  ]);

  return content && isVisible ? (
    <div
      css={[bannerStyle, isStartAnimation && animationBannerStyle]}
      className={className}
      test-id={testId}
    >
      <BannerAlert
        closable={closable}
        onClose={handleCloseButtonClick}
        icon={icon}
        backgroundColor={backgroundColor}
        wrapperContentStyle={wrapperContentStyle}
      >
        {alertContent}
      </BannerAlert>
    </div>
  ) : null;
};

export default Banner;
