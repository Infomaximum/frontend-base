import { useLocalization } from "../../decorators/hooks/useLocalization";
import { SHOWING_OF } from "../../utils/Localization/Localization";
import { Space, Spin } from "antd";
import {
  containerStyle,
  labelStyle,
  spinStyle,
} from "./RestLoadingIndicator.styles";
import type { IRestLoadingIndicatorProps } from "./RestLoadingIndicator.types";

const RestLoadingIndicatorComponent: React.FC<IRestLoadingIndicatorProps> = ({
  currentCount,
  totalCount,
}) => {
  const localization = useLocalization();

  return (
    <div css={containerStyle}>
      <Space size={16}>
        <div css={labelStyle}>
          {localization.getLocalized(SHOWING_OF, {
            templateData: {
              currentCount,
              totalCount,
            },
          })}
        </div>
        <Spin css={spinStyle} size="small" />
      </Space>
    </div>
  );
};

export const RestLoadingIndicator = RestLoadingIndicatorComponent;
