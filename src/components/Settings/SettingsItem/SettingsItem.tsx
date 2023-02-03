import React, { useCallback } from "react";
import type { ISettingsItemProps } from "./SettingsItem.types";
import { titleStyle, wrapperStyle, linkStyle } from "./SettingsItem.styles";
import { map } from "lodash";
import { Link } from "react-router-dom";
import { settingsItemTitleTestId } from "../../../utils/TestIds";
import { goBackPath } from "../../../utils/Routes/paths";
import { matchPath, useLocation, useNavigate } from "react-router";
import { assertSimple } from "@im/asserts";
import { useLocalization } from "../../../decorators/hooks/useLocalization";

const SettingsItem: React.FC<ISettingsItemProps> = ({
  onClick,
  title,
  routes,
}) => {
  const localization = useLocalization();
  const location = useLocation();
  const navigate = useNavigate();

  const rerenderCurrentRoute = useCallback(() => {
    // По пути goBackPath лежит роут, который перенаправит на текущую страницу
    // Хак нужен, для ререндера текущей страницы при клике, по ссылке текущей вкладки
    navigate(goBackPath);

    if (onClick) {
      onClick();
    }
  }, [navigate, onClick]);

  return (
    <div css={wrapperStyle}>
      <div test-id={settingsItemTitleTestId} css={titleStyle}>
        {title}
      </div>
      <div>
        {map(routes, (route) => {
          assertSimple(!!route.path, "Не передан path");
          assertSimple(!!route.loc, "Не передан loc");

          const isCurrentRoute = !!matchPath(route.path, location.pathname);

          return (
            <span
              key={route.key}
              onClick={isCurrentRoute ? rerenderCurrentRoute : onClick}
            >
              <Link to={route.path} css={linkStyle}>
                {localization.getLocalized(route.loc)}
              </Link>
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default SettingsItem;
