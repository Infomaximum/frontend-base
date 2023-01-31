import React, { useMemo } from "react";
import { ArrowLeftOutlined } from "../../Icons/Icons";
import { PageHeader as AntPageHeader } from "antd";
import {
  iconBackStyle,
  pageHeaderStyle,
  pageHeaderTitleStyle,
  headerTitleWrapperStyle,
} from "./PageHeader.styles";
import { pageHeaderBackButtonTestId } from "../../../utils/TestIds";
import type { IPageHeaderProps } from "./PageHeader.types";
import { useTheme } from "../../../decorators/hooks/useTheme";
import { cssStyleConversion } from "../../../styles";

const PageHeaderComponent: React.FC<IPageHeaderProps> = (props) => {
  const {
    title,
    onBack,
    titleStyle,
    leftOutlinedIcon,
    titleWrapperStyle,
    ...rest
  } = props;

  const theme = useTheme();

  const memoizedTitle = useMemo(() => {
    const testId = props["test-id"]
      ? `${props["test-id"]}_${pageHeaderBackButtonTestId}`
      : pageHeaderBackButtonTestId;

    return (
      <div
        onClick={onBack}
        css={cssStyleConversion(
          theme,
          titleWrapperStyle ?? headerTitleWrapperStyle
        )}
      >
        {leftOutlinedIcon ?? (
          <ArrowLeftOutlined test-id={testId} css={iconBackStyle(theme)} />
        )}
        <span
          css={cssStyleConversion(theme, titleStyle ?? pageHeaderTitleStyle)}
        >
          {title}
        </span>
      </div>
    );
  }, [
    title,
    titleStyle,
    onBack,
    props,
    leftOutlinedIcon,
    titleWrapperStyle,
    theme,
  ]);

  return (
    <AntPageHeader
      ghost={false}
      backIcon={false}
      css={pageHeaderStyle(theme)}
      title={memoizedTitle}
      {...rest}
    />
  );
};

export const PageHeader = React.memo(PageHeaderComponent);
