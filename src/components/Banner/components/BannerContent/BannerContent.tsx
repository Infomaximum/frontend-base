import { useContainerWidth } from "../../../../decorators/hooks/useContainerWidth";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import MarkdownView from "react-showdown";
import { Button } from "../../../Button/Button";
import type { IBannerContentProps } from "./BannerContent.types";
import { useLocalization } from "../../../../decorators/hooks/useLocalization";
import { SHOW_MORE } from "../../../../utils/Localization/Localization";
import { BannerContentModal } from "../BannerContentModal/BannerContentModal";
import {
  bannerContentParagraphStyle,
  bannerContentShowMoreButtonStyle,
  getBannerContentShowMoreStyle,
  bannerContentStyle,
} from "./BannerContent.styles";
import { showMoreBannerTestId } from "../../../../utils/TestIds";
import { useTheme } from "../../../../decorators";

const BannerContentComponent: React.FC<IBannerContentProps> = ({
  md,
  className,
  backgroundColor,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [showShowMoreButton, setShowShowMoreButton] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [containerWidth, setContainerRef] = useContainerWidth();
  const localization = useLocalization();
  const theme = useTheme();

  useEffect(() => {
    setContainerRef(contentRef.current);
  }, [setContainerRef]);

  useEffect(() => {
    if (contentRef.current) {
      // Делаем запас в 1px для корректной работы при разных масштабах окна браузера
      const scrollHeight = contentRef.current.scrollHeight - 1;

      if (!showShowMoreButton && contentRef.current.offsetHeight < scrollHeight) {
        setShowShowMoreButton(true);
      } else if (showShowMoreButton && contentRef.current.offsetHeight >= scrollHeight) {
        setShowShowMoreButton(false);
      }
    }
  }, [containerWidth, showShowMoreButton, md]);

  const handleShowMoreButtonClick = useCallback(() => {
    setShowModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
  }, []);

  const mdViewComponents = useMemo(
    () => ({
      p: (props: TDictionary) => {
        return <p css={bannerContentParagraphStyle} {...props} />;
      },
    }),
    []
  );

  const mdViewOptions = useMemo(() => ({ strikethrough: true }), []);

  return (
    <div ref={contentRef} className={className} css={bannerContentStyle(theme)}>
      <MarkdownView markdown={md} components={mdViewComponents} options={mdViewOptions} />
      {showShowMoreButton ? (
        <div css={getBannerContentShowMoreStyle(backgroundColor)}>
          {`... `}
          <Button
            type="link"
            css={bannerContentShowMoreButtonStyle(theme)}
            onClick={handleShowMoreButtonClick}
            test-id={showMoreBannerTestId}
          >
            {localization.getLocalized(SHOW_MORE)}
          </Button>
        </div>
      ) : null}
      <BannerContentModal md={md} open={showModal} onCancel={handleCloseModal} />
    </div>
  );
};

export const BannerContent = memo(BannerContentComponent);
