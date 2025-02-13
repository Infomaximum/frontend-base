import { memo, useCallback, useContext, useMemo, useRef, useState, type FC } from "react";
import type { ISettingsProps } from "./SettingsSider.types";
import { find, isEmpty, map } from "lodash";
import { Layout } from "antd";
import { useLocalization } from "../../decorators/hooks/useLocalization";
import { getSiderStyle, siderContentWrapperStyle } from "./SettingsSider.styles";
import { RoutesContext } from "../../decorators";
import { getDisplayedSettingsRoutes, settingsKey } from "../../utils";
import { SettingsGroup } from "./SettingsGroup/SettingsGroup";

const { Sider } = Layout;

const SettingsSiderComponent: FC<ISettingsProps> = ({ zoomRatio }) => {
  const localization = useLocalization();
  const [isScrolling, setScrolling] = useState(false);
  const scrollTimer = useRef<NodeJS.Timeout | null>(null);
  const routes = useContext(RoutesContext);

  const settingsRoutes = useMemo(() => {
    const settingsRoute = find(routes, (route) => route.key === settingsKey);

    return (settingsRoute && getDisplayedSettingsRoutes(settingsRoute.routes)) || [];
  }, [routes]);

  const hideScroll = useCallback(() => {
    setScrolling(false);
  }, []);

  const showScroll = useCallback(() => {
    setScrolling(true);
  }, []);

  /** Обработчик скроллинга, при скроллинге отображает scrollBar и через 500мс его прячет */
  const handleScroll = useCallback(() => {
    showScroll();

    if (scrollTimer.current) {
      clearTimeout(scrollTimer.current);
    }

    scrollTimer.current = setTimeout(() => {
      hideScroll();
    }, 500);
  }, [hideScroll, showScroll]);

  if (isEmpty(settingsRoutes)) {
    return null;
  }

  return (
    <Sider width="260px" css={getSiderStyle(isScrolling, zoomRatio)} onScroll={handleScroll}>
      <div css={siderContentWrapperStyle}>
        {map(settingsRoutes, (route) => (
          <SettingsGroup
            key={route.key}
            title={route.loc ? localization.getLocalized(route.loc) : ""}
            routes={route.routes}
          />
        ))}
      </div>
    </Sider>
  );
};

export const SettingsSider = memo(SettingsSiderComponent);
