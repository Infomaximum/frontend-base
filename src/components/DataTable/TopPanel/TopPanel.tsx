import React, { type FC, useCallback, useMemo } from "react";
import { Layout, Row, Col } from "antd";
import { SEARCH, SELECTED } from "../../../utils/Localization/Localization";
import {
  clearButtonStyle,
  customizeButtonStyle,
  headerStyle,
  rightButtonsColStyle,
} from "./TopPanel.styles";
import { headerModes } from "../DataTableHeader/DataTableHeader";
import { forEach, map, mapValues, remove } from "lodash";
import { topPanelTagCounterTestId, topPanelSearchInputTestId } from "../../../utils/TestIds";
import type { ITopPanelProps } from "./TopPanel.types";
import { reverseSearchBreakpoints, searchBreakpoints } from "../../../styles/searchLayout";
import { observer } from "mobx-react";
import { useLocalization } from "../../../decorators/hooks/useLocalization";
import { useFeature } from "../../../decorators/hooks/useFeature";
import { sortByPriority } from "../../../utils/Routes/routes";
import { isShowElement } from "../../../utils/access";
import { Tag } from "../../Tag";
import { Search } from "../../Search";
import { Button } from "../../Button";
import { CloseOutlined } from "../../Icons";

const { Header } = Layout;

export const MASS_ASSIGN_KEY = "mass-assign-key";
export const CONTEXT_MENU_FILTER = "context-menu-filter";

const TopPanelComponent: FC<ITopPanelProps> = (props) => {
  const {
    onInputChange,
    headerMode,
    headerButtonsObjects,
    selectedItemsCount,
    onSelectedItemsClear,
    searchValue,
    allowClear,
    customHeaderStyle,
    buttonsRowStyle,
    searchPlaceholder,
    isExpandedTopPanel,
  } = props;

  const localization = useLocalization();
  const { isFeatureEnabled } = useFeature();

  const resultHeaderStyle = useMemo(
    () =>
      customHeaderStyle
        ? [headerStyle(isExpandedTopPanel), customHeaderStyle]
        : headerStyle(isExpandedTopPanel),
    [customHeaderStyle, isExpandedTopPanel]
  );

  const sortedButtons = useMemo(() => {
    const leftButtons: React.ReactElement[] = [];
    const rightButtons: React.ReactElement[] = [];

    if (headerButtonsObjects) {
      forEach(sortByPriority(headerButtonsObjects), (buttonObject) => {
        if (buttonObject) {
          const { accessRules, component, float } = buttonObject;

          if (component && isFeatureEnabled && isShowElement(accessRules, isFeatureEnabled)) {
            float === "right" ? rightButtons.push(component) : leftButtons.push(component);
          }
        }
      });
    }

    return [leftButtons, rightButtons];
  }, [headerButtonsObjects, isFeatureEnabled]);

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

  const [leftButtons, rightButtons] = sortedButtons;

  const filterButton =
    headerMode === headerModes.REVERSE_SEARCH &&
    rightButtons?.find((button) => button.key === CONTEXT_MENU_FILTER);
  filterButton && rightButtons && remove(rightButtons, filterButton);

  const isShowSearch = Boolean(onInputChange) && headerMode !== headerModes.WITHOUT_SEARCH;
  const isShowButtons = !!leftButtons?.length || !!rightButtons?.length;

  const buttonsBreakpoints = useMemo(
    () =>
      isShowSearch
        ? headerMode === headerModes.REVERSE_SEARCH
          ? {}
          : mapValues(searchBreakpoints, (span) => 24 - span)
        : { span: 24 },
    [isShowSearch, headerMode]
  );

  if (!isShowSearch && !isShowButtons) {
    return null;
  }

  const selectionTag =
    selectedItemsCount > 0 && headerMode !== headerModes.REVERSE_SEARCH ? (
      <Tag
        key="tag-counter"
        closable={true}
        onClose={onSelectedItemsClear}
        test-id={topPanelTagCounterTestId}
      >
        {localization.getLocalized(SELECTED)} {selectedItemsCount}
      </Tag>
    ) : null;

  return (
    <Header css={resultHeaderStyle}>
      <Row
        align="middle"
        justify="space-between"
        gutter={headerMode === headerModes.REVERSE_SEARCH ? 0 : 8}
      >
        {headerMode === headerModes.REVERSE_SEARCH && isShowSearch && (
          <Col flex="auto">
            <Row gutter={8}>
              <Col>{filterButton}</Col>
              <Col {...reverseSearchBreakpoints}>
                <Search
                  key="input-search"
                  placeholder={searchPlaceholder || localization.getLocalized(SEARCH)}
                  onChange={onInputChange}
                  test-id={topPanelSearchInputTestId}
                  value={searchValue}
                  allowClear={allowClear}
                  size="small"
                  isSecond={true}
                />
              </Col>
              {rightButtons && <Col>{getButtonsRow(rightButtons)}</Col>}
            </Row>
          </Col>
        )}
        <Col {...buttonsBreakpoints}>
          <Row align="middle" gutter={headerMode === headerModes.REVERSE_SEARCH ? 0 : 24}>
            {leftButtons?.length ? <Col>{getButtonsRow(leftButtons)}</Col> : null}
            <Col>{selectionTag}</Col>
            {headerMode !== headerModes.REVERSE_SEARCH && rightButtons?.length ? (
              <Col css={rightButtonsColStyle}>{getButtonsRow(rightButtons)}</Col>
            ) : null}
          </Row>
        </Col>
        {headerMode !== headerModes.REVERSE_SEARCH && isShowSearch ? (
          <Col {...searchBreakpoints}>
            <Search
              key="input-search"
              placeholder={searchPlaceholder || localization.getLocalized(SEARCH)}
              onChange={onInputChange}
              test-id={topPanelSearchInputTestId}
              value={searchValue}
              allowClear={allowClear}
              size="small"
            />
          </Col>
        ) : null}
      </Row>
    </Header>
  );
};

const TopPanel = observer(TopPanelComponent);

export { TopPanel };
