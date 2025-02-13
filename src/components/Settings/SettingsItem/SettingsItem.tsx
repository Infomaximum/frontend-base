import React, { useCallback } from "react";
import type { ISettingsItemProps } from "./SettingsItem.types";
import { titleStyle, wrapperStyle, linkStyle, customLinkStyle } from "./SettingsItem.styles";
import { map } from "lodash";
import { Link } from "react-router-dom";
import { settingsItemTitleTestId } from "../../../utils/TestIds";
import { goBackPath } from "../../../utils/Routes/paths";
import { generatePath, matchPath, useLocation, useNavigate } from "react-router";
import { assertSimple } from "@infomaximum/assert";
import { useLocalization } from "../../../decorators/hooks/useLocalization";
import { BetaIconSVG } from "../../../resources/icons";

const SettingsItemComponent: React.FC<ISettingsItemProps> = ({ onClick, title, routes }) => {
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

          // Нужно чтобы убрать из шаблонного пути убрать динамические сегменты
          const path = generatePath(route.path);
          const isBeta = route.isBeta;
          const isCurrentRoute = !!matchPath(path, location.pathname);

          return (
            <span key={route.key} onClick={isCurrentRoute ? rerenderCurrentRoute : onClick}>
              <Link to={path} css={[linkStyle, isBeta && customLinkStyle]}>
                {localization.getLocalized(route.loc)}
                {isBeta && <BetaIconSVG />}
              </Link>
            </span>
          );
        })}
      </div>
    </div>
  );
};

export const SettingsItem = SettingsItemComponent;
