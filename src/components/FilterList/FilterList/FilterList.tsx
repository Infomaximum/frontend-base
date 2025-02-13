import React from "react";
import { Divider } from "antd";
import { floor, throttle, round, isNumber } from "lodash";
import HiddenFiltersButton from "../Buttons/HiddenFiltersButton/HiddenFiltersButton";
import {
  dividerVerticalStyle,
  dividerHorizontalStyle,
  getAnimationAddStyle,
  wrapperFiltersStyle,
  wrapperStyle,
  getAnimationRemoveStyle,
  wrapperVisibleFiltersStyle,
  menuStyle,
  overlayStyle,
} from "./FilterList.styles";
import type { IFilterListProps, IFilterListState } from "./FilterList.types";
import { boundMethod } from "../../../decorators";
import { BaseDropdown, EBaseDropdownPlacement } from "../../Dropdown";

enum EFilterItemWith {
  small = 139,
  large = 199,
}

class FilterList extends React.PureComponent<IFilterListProps, IFilterListState> {
  private readonly wrapperRef: React.RefObject<HTMLDivElement> = React.createRef();
  private readonly handlerWindow = throttle(this.handleWindowResize, 200);

  public override state = {
    widthWrapper: 0,
    maxCountFilterSmall: 1,
    maxCountFilterLarge: 0,
    showAnimationAdd: false,
    showAnimationRemove: false,
  };

  public override componentDidMount(): void {
    this.calculateValues(this.wrapperRef?.current?.offsetWidth);

    window.addEventListener("resize", this.handlerWindow);
    this.handleWindowResize();
  }

  public override componentDidUpdate(prevProps: Readonly<IFilterListProps>): void {
    const { children, removeFilterIndex } = this.props;
    const { count } = React.Children;

    if (count(prevProps.children) === 0 && count(children) > 0) {
      this.calculateValues(this.wrapperRef?.current?.offsetWidth);
    }

    if (count(children) > count(prevProps.children)) {
      this.setState({ showAnimationAdd: true });
    }

    // если удаляемый фильтр входит в список видимых фильтров
    if (
      count(children) < count(prevProps.children) &&
      isNumber(removeFilterIndex) &&
      removeFilterIndex > count(children) - this.state.maxCountFilterSmall
    ) {
      this.setState({ showAnimationAdd: false });
      this.setState({ showAnimationRemove: true });
    }
  }

  public override componentWillUnmount(): void {
    window.removeEventListener("resize", this.handlerWindow);
  }

  @boundMethod
  private handleWindowResize() {
    const widthWrapper = this.wrapperRef.current?.offsetWidth;
    widthWrapper !== this.state.widthWrapper && this.calculateValues(widthWrapper);
  }

  private calculateValues(widthWrapper: number | undefined) {
    if (isNumber(widthWrapper)) {
      this.setState({
        widthWrapper: widthWrapper,
        maxCountFilterSmall: round(widthWrapper / (EFilterItemWith.small + 1)),
        maxCountFilterLarge: floor(widthWrapper / (EFilterItemWith.large + 1)),
      });
    }
  }

  private isWidthLarge() {
    return React.Children.count(this.props.children) <= this.state.maxCountFilterLarge;
  }

  private getWidthFilter() {
    const { maxCountFilterSmall, maxCountFilterLarge, widthWrapper } = this.state;
    const widthFilter = floor(
      widthWrapper / (this.isWidthLarge() ? maxCountFilterLarge : maxCountFilterSmall)
    );

    if (widthFilter >= EFilterItemWith.large) {
      return EFilterItemWith.large;
    }

    if (widthFilter <= EFilterItemWith.small) {
      return EFilterItemWith.small;
    }

    return widthFilter;
  }

  private getVisibleFilter(filter: JSX.Element, widthCard: number, isLastSmallFilter: boolean) {
    const widthFilter = { width: `${widthCard}px` };

    return (
      <li key={`visible-filter_${filter.key}`}>
        <div style={widthFilter}>{filter}</div>
        {!isLastSmallFilter && <Divider css={dividerVerticalStyle} type="vertical" />}
      </li>
    );
  }

  private getVisibleFilterList(allFilters: JSX.Element[], maxCountVisibleFilters: number) {
    const { maxCountFilterSmall } = this.state;
    const filterList: JSX.Element[] = [];
    const widthCard = this.getWidthFilter();
    const isHiddenFilters = allFilters.length >= maxCountFilterSmall;

    for (let index = 0; index < allFilters.length; index += 1) {
      const filter = allFilters[index];

      if (index + 1 <= maxCountVisibleFilters && !!filter) {
        filterList.push(
          this.getVisibleFilter(
            filter,
            widthCard,
            isHiddenFilters && index + 1 >= maxCountFilterSmall - 1
          )
        );
      } else {
        break;
      }
    }

    return filterList;
  }

  private getHiddenFilter(filter: JSX.Element) {
    return (
      <li key={`hidden-filter_${filter?.key}`}>
        {React.cloneElement(filter, { isHidden: true })}
        <Divider type="horizontal" css={dividerHorizontalStyle} />
      </li>
    );
  }

  private getHiddenFilterList(allFilters: JSX.Element[]) {
    const filterList: JSX.Element[] = [];

    for (let index = this.state.maxCountFilterSmall - 1; index < allFilters.length; index += 1) {
      const filter = allFilters[index];

      if (filter) {
        filterList.push(this.getHiddenFilter(filter));
      }
    }

    return filterList;
  }

  private getDropdown(allFilters: JSX.Element[], maxCountVisibleFilters: number) {
    const { maxCountFilterSmall } = this.state;

    if (allFilters.length > maxCountVisibleFilters) {
      const dropdownButton = (
        <HiddenFiltersButton countFilters={allFilters.length - (maxCountFilterSmall || 1) + 1} />
      );

      return (
        <>
          <Divider css={dividerVerticalStyle} type="vertical" />
          <BaseDropdown
            button={dropdownButton}
            placement={EBaseDropdownPlacement.bottomRight}
            menuStyle={menuStyle}
            itemHeight={48}
            visibleMaxCount={13}
            padding={0}
            overlayStyle={overlayStyle}
          >
            {this.getHiddenFilterList(allFilters)}
          </BaseDropdown>
          <Divider css={dividerVerticalStyle} type="vertical" />
        </>
      );
    }

    return null;
  }

  @boundMethod
  private handleAnimationEnd() {
    this.setState({ showAnimationAdd: false, showAnimationRemove: false });
  }

  private getWrapperStyle(childrenLength: number) {
    const { maxCountFilterSmall, showAnimationAdd, showAnimationRemove } = this.state;
    const { removeFilterIndex } = this.props;
    const countVisibleFilters =
      childrenLength >= maxCountFilterSmall ? maxCountFilterSmall - 1 : childrenLength;

    if (showAnimationAdd) {
      return getAnimationAddStyle(countVisibleFilters, childrenLength);
    }

    if (showAnimationRemove && isNumber(removeFilterIndex)) {
      return getAnimationRemoveStyle(removeFilterIndex, countVisibleFilters);
    }

    return wrapperVisibleFiltersStyle;
  }

  public override render(): React.ReactNode {
    const { children } = this.props;
    const { maxCountFilterLarge, maxCountFilterSmall } = this.state;

    const childrenArray = React.Children.toArray(children).reverse() as JSX.Element[];

    if (childrenArray.length !== 0) {
      const isWidthStyle = childrenArray.length < this.state.maxCountFilterSmall;
      const maxCountVisibleFilters = this.isWidthLarge()
        ? maxCountFilterLarge
        : maxCountFilterSmall - 1;

      return (
        <div key="wrapper-filters" css={wrapperStyle}>
          <div key="wrapper-filters_content" ref={this.wrapperRef} css={wrapperFiltersStyle}>
            <ul
              key="list_visible-filters"
              css={[this.getWrapperStyle(childrenArray.length), isWidthStyle && { width: "100%" }]}
              onAnimationEnd={this.handleAnimationEnd}
            >
              {this.getVisibleFilterList(childrenArray, maxCountVisibleFilters)}
            </ul>
            {this.getDropdown(childrenArray, maxCountVisibleFilters)}
          </div>
        </div>
      );
    }

    return null;
  }
}

export default FilterList;
