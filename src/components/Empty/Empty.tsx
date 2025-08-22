import { useLocalization } from "@infomaximum/base/src/decorators/hooks/useLocalization";
import {
  NOTHING_FOUND,
  NO_ACCESS,
  NO_OBJECTS_MATCHING_FILTER_CRITERIA,
  EMPTY_HERE,
} from "@infomaximum/base/src/utils/Localization/Localization";
import { Empty as AntEmpty } from "antd";
import EmptyHereForNow from "@infomaximum/base/src/resources/icons/EmptyHereForNow.svg";
import NoObjectsMatchingFilterCriteria from "@infomaximum/base/src/resources/icons/NoObjectsMatchingFilterCriteria.svg";
import NothingFound from "@infomaximum/base/src/resources/icons/NothingFound.svg";
import NoAccessImage from "@infomaximum/base/src/resources/icons/NoAccessImage.svg";
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
import { useTheme } from "@infomaximum/base/src/decorators/hooks/useTheme";

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

  let emptyImage: React.ReactNode = <EmptyHereForNow />;
  let emptyCaption: React.ReactNode = localization.getLocalized(EMPTY_HERE);

  if (!description) {
    if (isBoolean(isSearchEmpty) && !isSearchEmpty) {
      emptyImage = <NothingFound />;
      emptyCaption = localization.getLocalized(NOTHING_FOUND);
    } else if (isBoolean(isFiltersEmpty) && !isFiltersEmpty) {
      emptyImage = <NoObjectsMatchingFilterCriteria />;
      emptyCaption = localization.getLocalized(NO_OBJECTS_MATCHING_FILTER_CRITERIA);
    } else if (isBoolean(isHasAccess) && !isHasAccess) {
      emptyImage = <NoAccessImage />;
      emptyCaption = localization.getLocalized(NO_ACCESS);
    }
  } else if (isBoolean(isSearchEmpty) && !isSearchEmpty) {
    emptyImage = <NothingFound />;
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
      styles={emptyImageStyle}
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
