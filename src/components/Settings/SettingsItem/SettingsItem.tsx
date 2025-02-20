import { type FC } from "react";
import type { ISettingsItemProps } from "./SettingsItem.types";
import { titleStyle, wrapperStyle, linkStyle, customLinkStyle } from "./SettingsItem.styles";
import { map } from "lodash";
import { Link } from "react-router-dom";
import { settingsItemTitleTestId } from "../../../utils/TestIds";
import { generatePath } from "react-router";
import { assertSimple } from "@infomaximum/assert";
import { useLocalization } from "../../../decorators/hooks/useLocalization";
import { BetaIconSVG } from "../../../resources/icons";

const SettingsItemComponent: FC<ISettingsItemProps> = ({ onClick, title, routes }) => {
  const localization = useLocalization();

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

          return (
            <span key={route.key} onClick={onClick}>
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
