import { type FC, useMemo, useRef } from "react";
import type { ICheckable, ITagProps } from "./Tag.types";
import { tagContentStyle } from "./Tag.styles";
import { AlignedTooltip } from "../AlignedTooltip";
import { Tag as UiKitTag } from "@infomaximum/ui-kit";

const TagComponent: FC<ITagProps> & ICheckable = (props) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { children, title, isWithoutTooltipWrapper, customTooltipWrapperStyle, ...restProps } =
    props;

  const tagRenderComponent = useMemo(() => {
    return (
      <UiKitTag key={`tag-${restProps.type}-${restProps.color}`} {...restProps} title={undefined}>
        <div ref={containerRef} css={tagContentStyle}>
          {children}
        </div>
      </UiKitTag>
    );
  }, [children, restProps]);

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

TagComponent.Checkable = UiKitTag.Checkable;
export const Tag = TagComponent;
