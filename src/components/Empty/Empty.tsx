import type React from "react";
import { useLocalization } from "../../decorators/hooks/useLocalization";
import {
  NOTHING_FOUND,
  NO_ACCESS,
  NO_OBJECTS_MATCHING_FILTER_CRITERIA,
  EMPTY_HERE,
} from "../../utils/Localization/Localization";
import { Empty as AntEmpty } from "antd";
import EmptyHereForNowSVG from "src/resources/icons/EmptyHereForNow.svg";
import NoObjectsMatchingFilterCriteriaSVG from "src/resources/icons/NoObjectsMatchingFilterCriteria.svg";
import NothingFoundSVG from "src/resources/icons/NothingFound.svg";
import NoAccessImage from "src/resources/icons/NoAccessImage.svg";
import {
  emptyDescriptionStyle,
  emptyHintStyle,
  emptyImageStyle,
  wrapperEmptyStyle,
  wrapperEmptyTableStyle,
  wrapperNotTableEmptyStyle,
} from "./Empty.styles";
import type { IEmptyProps } from "./Empty.types";
import { isBoolean, isUndefined } from "lodash";

const Empty: React.FC<IEmptyProps> = ({
  isFiltersEmpty,
  isSearchEmpty,
  isTableComponent,
  isHasAccess,
  hint,
  description,
  emptyContent,
  customEmptyTableStyle,
}) => {
  const localization = useLocalization();

  let emptyImage: React.ReactNode = <EmptyHereForNowSVG />;
  let emptyCaption: React.ReactNode = localization.getLocalized(EMPTY_HERE);

  if (!description) {
    if (isBoolean(isSearchEmpty) && !isSearchEmpty) {
      emptyImage = <NothingFoundSVG />;
      emptyCaption = localization.getLocalized(NOTHING_FOUND);
    } else if (isBoolean(isFiltersEmpty) && !isFiltersEmpty) {
      emptyImage = <NoObjectsMatchingFilterCriteriaSVG />;
      emptyCaption = localization.getLocalized(
        NO_OBJECTS_MATCHING_FILTER_CRITERIA
      );
    } else if (isBoolean(isHasAccess) && !isHasAccess) {
      emptyImage = <NoAccessImage />;
      emptyCaption = localization.getLocalized(NO_ACCESS);
    }
  } else {
    emptyCaption = description;
  }

  const emptyDescription = (
    <span css={emptyDescriptionStyle}>{emptyCaption}</span>
  );
  const emptyHint = hint && <span css={emptyHintStyle}>{hint}</span>;

  const defaultEmptyContent = (
    <AntEmpty
      key="empty"
      image={emptyImage}
      imageStyle={emptyImageStyle}
      description={emptyDescription}
      css={!isTableComponent ? wrapperNotTableEmptyStyle : undefined}
    >
      {emptyHint}
    </AntEmpty>
  );

  return (
    <div
      css={
        !!isTableComponent
          ? [wrapperEmptyTableStyle, customEmptyTableStyle]
          : wrapperEmptyStyle
      }
    >
      {isUndefined(emptyContent) ? defaultEmptyContent : emptyContent}
    </div>
  );
};

export default Empty;
