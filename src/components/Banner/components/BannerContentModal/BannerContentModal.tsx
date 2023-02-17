import { Button } from "../../../Button/Button";
import { Modal } from "../../../modals/Modal/Modal";
import { useLocalization } from "../../../../decorators/hooks/useLocalization";
import { useTheme } from "../../../../decorators/hooks/useTheme";
import { NOTIFICATION, CLOSE } from "../../../../utils/Localization/Localization";
import { memo, useMemo } from "react";
import MarkdownView from "react-showdown";
import { CloseOutlined } from "../../../Icons/Icons";
import {
  bannerContentModalBodyStyle,
  bannerContentModalParagraphStyle,
} from "./BannerContentModal.styles";
import type { IBannerContentModalProps } from "./BannerContentModal.types";
import { closeModalIconStyle } from "../../../../styles/common.styles";

const BannerContentModalComponent: React.FC<IBannerContentModalProps> = ({
  visible,
  onCancel,
  md,
}) => {
  const localization = useLocalization();
  const theme = useTheme();

  const modalFooter = useMemo(
    () => (
      <Button type="primary" onClick={onCancel}>
        {localization.getLocalized(CLOSE)}
      </Button>
    ),
    [localization, onCancel]
  );

  const mdViewComponents = useMemo(
    () => ({
      p: (props: TDictionary) => {
        return <p css={bannerContentModalParagraphStyle} {...props} />;
      },
    }),
    []
  );

  const mdViewOptions = useMemo(() => ({ strikethrough: true }), []);

  const closeIcon = <CloseOutlined css={closeModalIconStyle} />;

  return (
    <Modal
      title={localization.getLocalized(NOTIFICATION)}
      visible={visible}
      width={theme.modalLargeWidth}
      onCancel={onCancel}
      bodyStyle={bannerContentModalBodyStyle}
      footer={modalFooter}
      centered={true}
      closeIcon={closeIcon}
    >
      <MarkdownView markdown={md} components={mdViewComponents} options={mdViewOptions} />
    </Modal>
  );
};

export const BannerContentModal = memo(BannerContentModalComponent);
