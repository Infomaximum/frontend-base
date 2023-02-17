import type React from "react";
import { Empty } from "antd";
import type { IDropdownPlaceholderProps } from "./DropdownPlaceholder.types";
import { emptyStyle, emptyImageStyle, hintStyle } from "./DropdownPlaceholder.styles";
import NothingFoundBox from "../../../resources/icons/NothingFoundBox.svg";
import NoAccess from "../../../resources/icons/NoAccess.svg";
import { useLocalization } from "../../../decorators/hooks/useLocalization";
import {
  EMPTY_HERE,
  NO_ACCESS,
  NOTHING_FOUND_CHANGE_QUERY,
} from "../../../utils/Localization/Localization";
import { useTheme } from "../../../decorators/hooks/useTheme";

/**
 * Placeholder выпадающего списка (данные запрашиваются 1 раз).
 * Варианты отображения:
 * - Если нет контента
 * - Если нет контента по поисковой строке
 * - Если нет доступа
 */
const DropdownPlaceholderComponent: React.FC<IDropdownPlaceholderProps> = ({
  searchText,
  hasAccess = true,
  emptyText,
}) => {
  const localization = useLocalization();
  const theme = useTheme();

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
        css={emptyStyle(theme)}
      />
    );
  }

  return (
    <Empty
      key="empty-select"
      image={<NothingFoundBox />}
      imageStyle={emptyImageStyle}
      description={emptyText ?? localization.getLocalized(EMPTY_HERE)}
      css={emptyStyle(theme)}
    />
  );
};

export const DropdownPlaceholder = DropdownPlaceholderComponent;
