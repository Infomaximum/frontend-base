import { type FC, useMemo, useRef } from "react";
import type { ITagProps } from "./Tag.types";
// eslint-disable-next-line im/ban-import-entity
import { Tag as AntTag } from "antd";
import {
  getTagStyle,
  notClosableTagStyle,
  notColoredTagStyle,
  tagContentStyle,
} from "./Tag.styles";
import { useTheme } from "../../decorators/hooks/useTheme";
import { get } from "lodash";
import { AlignedTooltip } from "../AlignedTooltip";

const TagComponent: FC<ITagProps> = (props) => {
  const theme = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);

  const { tagsStyles } = theme;
  const { closable, color: colorProps = "default", children, title } = props;
  const { isWithoutTooltipWrapper, customTooltipWrapperStyle, ...restProps } = props;

  const { backgroundColor, borderColor, textColor, closeIconColor, closeIconColorHover } = (get(
    tagsStyles,
    colorProps
  ) as valueof<typeof tagsStyles> | undefined) ?? {
    backgroundColor: theme.grey3Color,
    borderColor: theme.grey4Color,
    textColor: theme.grey8Color,
    closeIconColor: theme.grey7Color,
    closeIconColorHover: theme.grey8Color,
  };

  const tagStyle = useMemo(
    () =>
      getTagStyle(
        String(borderColor),
        String(textColor),
        String(backgroundColor),
        String(closeIconColor),
        String(closeIconColorHover)
      ),
    [borderColor, textColor, backgroundColor, closeIconColor, closeIconColorHover]
  );

  const tagCssRule = useMemo(() => {
    const resultStyleArray = [];

    if (colorProps === "default") {
      resultStyleArray.push(notColoredTagStyle);
    }

    if (closable) {
      resultStyleArray.push(tagStyle);
    } else {
      resultStyleArray.push(tagStyle, notClosableTagStyle);
    }

    return resultStyleArray;
  }, [colorProps, closable, tagStyle]);

  const tagRenderComponent = useMemo(
    () => (
      <AntTag key={colorProps} {...restProps} css={tagCssRule} color={colorProps} title={undefined}>
        <div ref={containerRef} css={tagContentStyle}>
          {children}
        </div>
      </AntTag>
    ),
    [children, colorProps, restProps, tagCssRule]
  );

  return isWithoutTooltipWrapper ? (
    tagRenderComponent
  ) : (
    <AlignedTooltip
      title={title ?? children}
      expandByParent={false}
      customStyle={customTooltipWrapperStyle}
      containerRef={containerRef}
    >
      {tagRenderComponent}
    </AlignedTooltip>
  );
};

export const Tag = TagComponent;
