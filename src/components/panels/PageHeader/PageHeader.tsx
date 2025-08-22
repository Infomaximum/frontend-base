import React, { useMemo } from "react";
import { ArrowLeftOutlined } from "@infomaximum/base/src/components/Icons/Icons";
import { PageHeader as AntPageHeader } from "@ant-design/pro-layout";
import {
  iconBackStyle,
  pageHeaderStyle,
  pageHeaderTitleStyle,
  headerTitleWrapperStyle,
} from "./PageHeader.styles";
import { pageHeaderBackButtonTestId } from "@infomaximum/base/src/utils/TestIds";
import type { IPageHeaderProps } from "./PageHeader.types";
import { useTheme } from "@infomaximum/base/src/decorators/hooks/useTheme";
import { getCssConversionStyle } from "@infomaximum/base/src/styles";

const PageHeaderComponent: React.FC<IPageHeaderProps> = (props) => {
  const { title, onBack, titleStyle, leftOutlinedIcon, titleWrapperStyle, ...rest } = props;

  const theme = useTheme();

  const memoizedTitle = useMemo(() => {
    const testId = props["test-id"]
      ? `${props["test-id"]}_${pageHeaderBackButtonTestId}`
      : pageHeaderBackButtonTestId;

    return (
      <div
        onClick={onBack}
        css={getCssConversionStyle(theme, titleWrapperStyle ?? headerTitleWrapperStyle)}
      >
        {leftOutlinedIcon ?? <ArrowLeftOutlined test-id={testId} css={iconBackStyle(theme)} />}
        <span css={getCssConversionStyle(theme, titleStyle ?? pageHeaderTitleStyle)}>{title}</span>
      </div>
    );
  }, [title, titleStyle, onBack, props, leftOutlinedIcon, titleWrapperStyle, theme]);

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
