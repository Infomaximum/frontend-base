import React, { memo, useCallback } from "react";
import type { ISettingsGroupProps } from "./SettingsGroup.types";
import {
  titleStyle,
  wrapperStyle,
  linkStyle,
  betaLinkStyle,
  linkWrapperStyle,
  currentRouteStyle,
} from "./SettingsGroup.styles";
import { map } from "lodash";
import { Link } from "react-router-dom";
import { settingsItemTitleTestId } from "../../../utils/TestIds";
import { goBackPath } from "../../../utils/Routes/paths";
import { generatePath, matchPath, useLocation, useNavigate } from "react-router";
import { assertSimple } from "@infomaximum/assert";
import { useLocalization } from "../../../decorators/hooks/useLocalization";
import { BetaIconSVG } from "../../../resources/icons";

const SettingsGroupComponent: React.FC<ISettingsGroupProps> = ({ title, routes }) => {
  const localization = useLocalization();
  const location = useLocation();
  const navigate = useNavigate();

  const rerenderCurrentRoute = useCallback(() => {
    // По пути goBackPath лежит роут, который перенаправит на текущую страницу
    // Хак нужен, для ререндера текущей страницы при клике, по ссылке текущей вкладки
    navigate(goBackPath);
  }, [navigate]);

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
          const isCurrentRoute = !!matchPath(`${path}/*`, location.pathname);

          return (
            <div key={route.key} onClick={isCurrentRoute ? rerenderCurrentRoute : undefined}>
              <Link
                to={path}
                css={[
                  linkWrapperStyle,
                  linkStyle,
                  isBeta && betaLinkStyle,
                  isCurrentRoute && currentRouteStyle,
                ]}
              >
                {localization.getLocalized(route.loc)}
                {isBeta && <BetaIconSVG />}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const SettingsGroup = memo(SettingsGroupComponent);
