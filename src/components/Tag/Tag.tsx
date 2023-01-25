import { FC, useMemo } from "react";
import type { ITagProps } from "./Tag.types";
// eslint-disable-next-line im/ban-import-entity
import { Tag as AntTag } from "antd";
import {
  getTagStyle,
  notClosableTagStyle,
  tagContentStyle,
} from "./Tag.styles";
import { useTheme } from "../../decorators/hooks/useTheme";
import { get } from "lodash";
import Tooltip from "../Tooltip/Tooltip";

const Tag: FC<ITagProps> = (props) => {
  const theme = useTheme();

  const { tagsStyles } = theme;
  const { closable, color: colorProps = "default", children, title } = props;

  const { backgroundColor, borderColor, textColor } = (get(
    tagsStyles,
    colorProps
  ) as valueof<typeof tagsStyles> | undefined) ?? {
    backgroundColor: theme.grey3Color,
    borderColor: theme.grey4Color,
    textColor: theme.grey8Color,
  };

  const tagStyle = useMemo(
    () =>
      getTagStyle(
        String(borderColor),
        String(textColor),
        String(backgroundColor)
      ),
    [backgroundColor, borderColor, textColor]
  );

  const tagCssRule = useMemo(() => {
    if (closable) {
      return tagStyle;
    }

    return [tagStyle, notClosableTagStyle];
  }, [tagStyle, closable]);

  return (
    <Tooltip title={title}>
      <AntTag
        key={colorProps}
        {...props}
        css={tagCssRule}
        color={colorProps}
        title={undefined}
      >
        <div css={tagContentStyle}>{children}</div>
      </AntTag>
    </Tooltip>
  );
};

export default Tag;
