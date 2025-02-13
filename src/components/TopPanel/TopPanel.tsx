import React, { type FC, useCallback, useMemo, useState } from "react";
import { Layout, Row, Col } from "antd";
import { SEARCH } from "../../utils/Localization/Localization";
import {
  clearButtonStyle,
  customizeButtonStyle,
  headerStyle,
  rightButtonsColStyle,
  selectedFiltersWrapperStyle,
} from "./TopPanel.styles";
import { forEach, map, mapValues } from "lodash";
import { topPanelSearchInputTestId } from "../../utils/TestIds";
import type { ITopPanelProps } from "./TopPanel.types";
import { reverseSearchBreakpoints, searchBreakpoints } from "../../styles/searchLayout";
import { observer } from "mobx-react";
import { useLocalization } from "../../decorators/hooks/useLocalization";
import { useFeature } from "../../decorators/hooks/useFeature";
import { sortByPriority } from "../../utils/Routes/routes";
import { isShowElement } from "../../utils/access";
import { Search } from "../Search";
import { Button } from "../Button";
import { CloseOutlined } from "../Icons";
import { TopPanelContext } from "../../decorators";

const { Header } = Layout;

export const topPanelModes = {
  LIST: "list",
  WITHOUT_SEARCH: "withoutsearch",
};

export const MASS_ASSIGN_KEY = "mass-assign-key";
export const CONTEXT_MENU_FILTER = "context-menu-filter";

// переписать после влития хотя бы Часть 1 новой навигации, как будет время, все условия!!!
const TopPanelComponent: FC<ITopPanelProps> = (props) => {
  const {
    onInputChange,
    mode = topPanelModes.LIST,
    buttonObjects,
    onSelectedItemsClear,
    searchValue,
    allowClear,
    customHeaderStyle,
    customSelectedFiltersWrapperStyle,
    buttonsRowStyle,
    searchPlaceholder,
    isSearchDisabled,
    searchBreakpoints: searchBreakpointsProp,
  } = props;

  const localization = useLocalization();
  const { isFeatureEnabled } = useFeature();
  const [topPanelContainer, setTopPanelContainer] = useState<HTMLDivElement | null>(null);

  const resultHeaderStyle = useMemo(
    () => (customHeaderStyle ? [headerStyle, customHeaderStyle] : headerStyle),
    [customHeaderStyle]
  );

  const resultSelectedFiltersWrapperStyle = useMemo(() => {
    return [
      customSelectedFiltersWrapperStyle
        ? [selectedFiltersWrapperStyle, customSelectedFiltersWrapperStyle]
        : selectedFiltersWrapperStyle,
    ];
  }, [customSelectedFiltersWrapperStyle]);

  const sortedButtons: [React.ReactElement[], React.ReactElement[]] = useMemo(() => {
    const leftButtons: React.ReactElement[] = [];
    const rightButtons: React.ReactElement[] = [];

    if (buttonObjects) {
      forEach(sortByPriority(buttonObjects), (buttonObject) => {
        if (buttonObject) {
          const { accessRules, component, float } = buttonObject;

          if (component && isFeatureEnabled && isShowElement(accessRules, isFeatureEnabled)) {
            float === "left" ? leftButtons.push(component) : rightButtons.push(component);
          }
        }
      });
    }

    return [leftButtons, rightButtons];
  }, [buttonObjects, isFeatureEnabled]);

  const getCustomizeButton = useCallback(
    (button: React.ReactElement) => (
      <div css={customizeButtonStyle}>
        {button}
        <Button
          icon={<CloseOutlined />}
          size="small"
          onClick={onSelectedItemsClear}
          css={clearButtonStyle}
        />
      </div>
    ),
    [onSelectedItemsClear]
  );

  const getButtonsRow = useCallback(
    (buttons: React.ReactElement[]) => (
      <Row align="middle" gutter={8} {...buttonsRowStyle}>
        {map(buttons, (button) => (
          <Col key={button.key}>
            {button.key === MASS_ASSIGN_KEY ? getCustomizeButton(button) : button}
          </Col>
        ))}
      </Row>
    ),
    [buttonsRowStyle, getCustomizeButton]
  );

  const [notFilteredLeftButtons, rightButtons] = sortedButtons;

  const filterButton = notFilteredLeftButtons.find((button) => button.key === CONTEXT_MENU_FILTER);

  const leftButtons = notFilteredLeftButtons.filter((button) => button.key !== CONTEXT_MENU_FILTER);

  const isShowSearch = Boolean(onInputChange) && mode !== topPanelModes.WITHOUT_SEARCH;
  const isShowButtons = !!leftButtons.length || !!rightButtons.length || Boolean(filterButton);

  const buttonsBreakpoints = useMemo(
    () =>
      isShowSearch
        ? mode === topPanelModes.LIST
          ? {}
          : mapValues(searchBreakpoints, (span) => 24 - span)
        : mode === topPanelModes.WITHOUT_SEARCH
          ? {}
          : { span: 24 },
    [isShowSearch, mode]
  );

  if (!isShowSearch && !isShowButtons) {
    return null;
  }

  const gutter = mode === topPanelModes.LIST || leftButtons.length < 2 ? 0 : 8;

  return (
    <Header css={resultHeaderStyle}>
      <TopPanelContext.Provider value={topPanelContainer}>
        <Row align="middle" justify="space-between" gutter={gutter}>
          <Col flex="auto">
            <Row gutter={8}>
              {filterButton && <Col>{filterButton}</Col>}
              {isShowSearch && (
                <Col
                  {...(searchBreakpointsProp ? searchBreakpointsProp : reverseSearchBreakpoints)}
                >
                  <Search
                    key="input-search"
                    placeholder={searchPlaceholder || localization.getLocalized(SEARCH)}
                    onChange={onInputChange}
                    test-id={topPanelSearchInputTestId}
                    value={searchValue}
                    allowClear={allowClear}
                    size="small"
                    disabled={isSearchDisabled}
                  />
                </Col>
              )}
              {!!leftButtons.length && <Col>{getButtonsRow(leftButtons)}</Col>}
            </Row>
          </Col>

          <Col {...buttonsBreakpoints}>
            <Row align="middle" gutter={mode === topPanelModes.LIST ? 0 : 24}>
              {rightButtons?.length ? (
                <Col css={rightButtonsColStyle}>{getButtonsRow(rightButtons)}</Col>
              ) : null}
            </Row>
          </Col>
          {mode !== topPanelModes.LIST && isShowSearch ? (
            <Col {...searchBreakpoints}>
              <Search
                key="input-search"
                placeholder={searchPlaceholder || localization.getLocalized(SEARCH)}
                onChange={onInputChange}
                test-id={topPanelSearchInputTestId}
                value={searchValue}
                allowClear={allowClear}
                size="small"
                disabled={isSearchDisabled}
              />
            </Col>
          ) : null}
        </Row>
        <Row ref={setTopPanelContainer} css={resultSelectedFiltersWrapperStyle} wrap={false} />
      </TopPanelContext.Provider>
    </Header>
  );
};

export const TopPanel = observer(TopPanelComponent);
