import type { FC } from "react";
import type { ISettingsProps } from "./Settings.types";
import { SettingsItem } from "./SettingsItem/SettingsItem";
import {
  calculateSize,
  leftColumnStyles,
} from "./SettingsItem/SettingsItem.styles";
import { forEach, map } from "lodash";
import { Layout, Space } from "antd";
import { settingsContentStyle } from "./Settings.styles";
import type { NCore } from "@im/core";
import { useLocalization } from "../../decorators/hooks/useLocalization";

const { Content } = Layout;

const SettingsComponent: FC<ISettingsProps> = ({
  routes: settingRoutes,
  onItemClick,
}) => {
  const localization = useLocalization();

  const getColumns = () => {
    if (!settingRoutes) {
      return [];
    }

    const leftColumn: NCore.IRoutes[] = [];
    const rightColumn: NCore.IRoutes[] = [];
    let leftColumnSize = 0;
    let rightColumnSize = 0;

    forEach(settingRoutes, (route) => {
      const routeSize = calculateSize(route);
      if (leftColumnSize <= rightColumnSize) {
        leftColumn.push(route);
        leftColumnSize += routeSize;
      } else {
        rightColumn.push(route);
        rightColumnSize += routeSize;
      }
    });

    return [leftColumn, rightColumn];
  };

  return (
    <Content css={settingsContentStyle}>
      <Space size={48} direction="horizontal" align="start">
        {map(getColumns(), (column, key) => (
          <div key={key} css={key === 0 ? leftColumnStyles : undefined}>
            {map(column, (route) => (
              <SettingsItem
                key={route.key}
                title={route.loc ? localization.getLocalized(route.loc) : ""}
                routes={route.routes}
                onClick={onItemClick}
              />
            ))}
          </div>
        ))}
      </Space>
    </Content>
  );
};

export const Settings = SettingsComponent;
