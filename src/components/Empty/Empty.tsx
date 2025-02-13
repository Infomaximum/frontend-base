import { useLocalization } from "../../decorators/hooks/useLocalization";
import {
  NOTHING_FOUND,
  NO_ACCESS,
  NO_OBJECTS_MATCHING_FILTER_CRITERIA,
  EMPTY_HERE,
} from "../../utils/Localization/Localization";
import { Empty as AntEmpty } from "antd";
import EmptyHereForNowSVG from "../../resources/icons/EmptyHereForNow.svg";
import NoObjectsMatchingFilterCriteriaSVG from "../../resources/icons/NoObjectsMatchingFilterCriteria.svg";
import NothingFoundSVG from "../../resources/icons/NothingFound.svg";
import NoAccessImage from "../../resources/icons/NoAccessImage.svg";
import {
  emptyDescriptionStyle,
  emptyHintStyle,
  emptyImageStyle,
  wrapperEmptyStyle,
  getWrapperEmptyTableStyle,
  wrapperNotTableEmptyStyle,
} from "./Empty.styles";
import type { IEmptyProps } from "./Empty.types";
import { isBoolean, isUndefined } from "lodash";
import { useTheme } from "../../decorators/hooks/useTheme";

const EmptyComponent: React.FC<IEmptyProps> = ({
  isFiltersEmpty,
  isSearchEmpty,
  isTableComponent,
  isHasAccess,
  hint,
  description,
  emptyContent,
  emptyImage: emptyImageProps,
  customEmptyTableStyle,
  isLoading,
  isVirtualized,
}) => {
  const localization = useLocalization();
  const theme = useTheme();

  let emptyImage: React.ReactNode = <EmptyHereForNowSVG />;
  let emptyCaption: React.ReactNode = localization.getLocalized(EMPTY_HERE);

  if (!description) {
    if (isBoolean(isSearchEmpty) && !isSearchEmpty) {
      emptyImage = <NothingFoundSVG />;
      emptyCaption = localization.getLocalized(NOTHING_FOUND);
    } else if (isBoolean(isFiltersEmpty) && !isFiltersEmpty) {
      emptyImage = <NoObjectsMatchingFilterCriteriaSVG />;
      emptyCaption = localization.getLocalized(NO_OBJECTS_MATCHING_FILTER_CRITERIA);
    } else if (isBoolean(isHasAccess) && !isHasAccess) {
      emptyImage = <NoAccessImage />;
      emptyCaption = localization.getLocalized(NO_ACCESS);
    }
  } else if (isBoolean(isSearchEmpty) && !isSearchEmpty) {
    emptyImage = <NothingFoundSVG />;
    emptyCaption = description;
  } else {
    emptyCaption = description;
  }

  const emptyDescription = <span css={emptyDescriptionStyle(theme)}>{emptyCaption}</span>;
  const emptyHint = hint && <span css={emptyHintStyle(theme)}>{hint}</span>;

  const defaultEmptyContent = (
    <AntEmpty
      key="empty"
      image={emptyImageProps ?? emptyImage}
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
          ? [getWrapperEmptyTableStyle(isLoading, isVirtualized), customEmptyTableStyle]
          : wrapperEmptyStyle
      }
    >
      {isUndefined(emptyContent) ? defaultEmptyContent : emptyContent}
    </div>
  );
};

export const Empty = EmptyComponent;
