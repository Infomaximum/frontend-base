import React, { useMemo } from "react";
import { ArrowLeftOutlined } from "@im/base/src/components/Icons/Icons";
import { PageHeader as AntPageHeader } from "antd";
import {
  iconBackStyle,
  pageHeaderStyle,
  pageHeaderTitleStyle,
  headerTitleWrapperStyle,
} from "./PageHeader.styles";
import { pageHeaderBackButtonTestId } from "@im/base/src/utils/TestIds";
import type { IPageHeaderProps } from "./PageHeader.types";

const PageHeader: React.FC<IPageHeaderProps> = (props) => {
  const { title, onBack, titleStyle, leftOutlinedIcon, titleWrapperStyle, ...rest } = props;

  const memoizedTitle = useMemo(() => {
    const testId = props["test-id"]
      ? `${props["test-id"]}_${pageHeaderBackButtonTestId}`
      : pageHeaderBackButtonTestId;

    return (
      <div onClick={onBack} css={titleWrapperStyle ?? headerTitleWrapperStyle}>
        {leftOutlinedIcon ?? <ArrowLeftOutlined test-id={testId} css={iconBackStyle} />}
        <span css={titleStyle ?? pageHeaderTitleStyle}>{title}</span>
      </div>
    );
  }, [title, titleStyle, onBack, props, leftOutlinedIcon, titleWrapperStyle]);

  return (
    <AntPageHeader
      ghost={false}
      backIcon={false}
      css={pageHeaderStyle}
      title={memoizedTitle}
      {...rest}
    />
  );
};

export default React.memo(PageHeader);
