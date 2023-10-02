import { type FC, useMemo, useRef } from "react";
import type { ITagProps } from "./Tag.types";
// eslint-disable-next-line im/ban-import-entity
import { Tag as AntTag } from "antd";
import { getTagStyle, notClosableTagStyle, tagContentStyle, tagOverlayStyle } from "./Tag.styles";
import { useTheme } from "../../decorators/hooks/useTheme";
import { get } from "lodash";
import { Tooltip } from "../Tooltip";
import { useOverflow } from "../../decorators/hooks/useOverflow";

const TagComponent: FC<ITagProps> = (props) => {
  const theme = useTheme();

  const { tagsStyles } = theme;
  const { closable, color: colorProps = "default", children, title, style } = props;

  const ref = useRef<HTMLDivElement>(null);
  const { isOverflow } = useOverflow(ref, children, title);

  const { backgroundColor, borderColor, textColor } = (get(tagsStyles, colorProps) as
    | valueof<typeof tagsStyles>
    | undefined) ?? {
    backgroundColor: theme.grey3Color,
    borderColor: theme.grey4Color,
    textColor: theme.grey8Color,
  };

  const tagStyle = useMemo(
    () => getTagStyle(String(borderColor), String(textColor), String(backgroundColor)),
    [backgroundColor, borderColor, textColor]
  );

  const tagCssRule = useMemo(() => {
    if (closable) {
      return tagStyle;
    }

    return [tagStyle, notClosableTagStyle];
  }, [tagStyle, closable]);

  return (
    <Tooltip title={title ?? (isOverflow && children)}>
      <AntTag key={colorProps} {...props} css={tagCssRule} color={colorProps} title={undefined}>
        <div css={tagContentStyle} ref={ref}>
          {children}
          {isOverflow && (
            <div
              css={tagOverlayStyle(
                backgroundColor,
                closable ? "20px" : style?.paddingRight || "7px"
              )}
            />
          )}
        </div>
      </AntTag>
    </Tooltip>
  );
};

export const Tag = TagComponent;
