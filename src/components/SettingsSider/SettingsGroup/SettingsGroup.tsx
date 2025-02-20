import { memo, type FC } from "react";
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
import { generatePath, matchPath, useLocation } from "react-router";
import { assertSimple } from "@infomaximum/assert";
import { useLocalization } from "../../../decorators/hooks/useLocalization";
import { BetaIconSVG } from "../../../resources/icons";

const SettingsGroupComponent: FC<ISettingsGroupProps> = ({ title, routes }) => {
  const localization = useLocalization();
  const location = useLocation();

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
            <Link
              to={path}
              key={route.key}
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
          );
        })}
      </div>
    </div>
  );
};

export const SettingsGroup = memo(SettingsGroupComponent);
