import React from "react";
import { Empty } from "antd";
import type { IDropdownPlaceholderProps } from "./DropdownPlaceholder.types";
import { emptyStyle, emptyImageStyle, hintStyle } from "./DropdownPlaceholder.styles";
import NothingFoundBox from "@im/base/src/resources/icons/NothingFoundBox.svg";
import NoAccess from "@im/base/src/resources/icons/NoAccess.svg";
import { useLocalization } from "@im/base/src/decorators/hooks/useLocalization";
import {
  EMPTY_HERE,
  NO_ACCESS,
  NOTHING_FOUND_CHANGE_QUERY,
} from "@im/base/src/utils/Localization/Localization";

/**
 * Placeholder выпадающего списка (данные запрашиваются 1 раз).
 * Варианты отображения:
 * - Если нет контента
 * - Если нет контента по поисковой строке
 * - Если нет доступа
 */
const DropdownPlaceholder: React.FC<IDropdownPlaceholderProps> = ({
  searchText,
  hasAccess = true,
}) => {
  const localization = useLocalization();

  if (!!searchText) {
    return <span css={hintStyle}>{localization.getLocalized(NOTHING_FOUND_CHANGE_QUERY)}</span>;
  }

  if (!hasAccess) {
    return (
      <Empty
        key="no-access"
        image={<NoAccess />}
        imageStyle={emptyImageStyle}
        description={localization.getLocalized(NO_ACCESS)}
        css={emptyStyle}
      />
    );
  }

  return (
    <Empty
      key="empty-select"
      image={<NothingFoundBox />}
      imageStyle={emptyImageStyle}
      description={localization.getLocalized(EMPTY_HERE)}
      css={emptyStyle}
    />
  );
};

export default DropdownPlaceholder;
