import React, { type KeyboardEvent } from "react";
import type { ISearchProps, ISearchState } from "./Search.types";
import { Input } from "../Input/Input";
import { isString, isFunction, isEmpty } from "lodash";
import { KeyupRequestInterval } from "../../utils/const";
import { SearchOutlined } from "../Icons/Icons";
import {
  iconStyle,
  searchMiddleInputStyle,
  searchSecondInputStyle,
  searchSmallInputStyle,
} from "./Search.style";
import type { Interpolation } from "@emotion/react";
import { boundMethod, withTheme } from "../../decorators";
import { CloseSVG } from "../../resources";

class SearchComponent extends React.PureComponent<ISearchProps, ISearchState> {
  public static defaultProps = {
    allowClear: true,
    size: "middle" as const,
    isSecond: false,
  };

  private static getPrefixIcon = (theme: TTheme) => (
    <SearchOutlined key="search-icon" css={iconStyle(theme)} />
  );

  private timer: NodeJS.Timeout | undefined;
  private lastRequestSearchText: string | undefined;

  constructor(props: ISearchProps) {
    super(props);

    this.timer = undefined;
    this.lastRequestSearchText = props.value ?? "";

    this.state = {
      searchText: props.value ?? "",
    };
  }

  public override componentDidUpdate(prevProps: ISearchProps, prevState: ISearchState) {
    const { searchText } = this.state;
    const { value } = this.props;

    if (searchText !== prevState.searchText) {
      this.handleChange();
    } else if (prevProps.value !== value && value !== searchText) {
      this.setState({
        searchText: this.props.value ?? undefined,
      });
    }
  }

  public override componentWillUnmount(): void {
    this.timer && clearTimeout(this.timer);
  }

  private handleChangeState = (e: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({
      searchText: e.target.value,
    });
  };

  @boundMethod
  private handleChangeSearchValue() {
    const { searchText } = this.state;
    const { onChange } = this.props;

    if (isString(searchText) && isFunction(onChange) && searchText !== this.lastRequestSearchText) {
      this.lastRequestSearchText = searchText;
      onChange?.(searchText);
    }
  }

  private handleChange = () => {
    this.timer && clearTimeout(this.timer);

    if (this.props.clearWithoutDelay && isEmpty(this.state.searchText)) {
      this.handleChangeSearchValue();

      return;
    }

    this.props.onBeforeChange?.();
    this.timer = setTimeout(this.handleChangeSearchValue, KeyupRequestInterval);
  };

  @boundMethod
  private handlePressEnter(e: KeyboardEvent<HTMLInputElement>) {
    this.timer && clearTimeout(this.timer);
    this.props.onPressEnter?.(e);
    this.handleChangeSearchValue();
  }

  public override render() {
    const { onChange, value, size, theme, isSecond, onBeforeChange, clearWithoutDelay, ...rest } =
      this.props;
    const clearIcon = isSecond ? <CloseSVG /> : null;

    const getInputStyle = (): Interpolation<TTheme> => {
      if (isSecond) {
        return searchSecondInputStyle;
      }

      let inputStyle: Interpolation<TTheme>;

      switch (size) {
        case "middle":
          inputStyle = searchMiddleInputStyle;
          break;
        case "small":
          inputStyle = searchSmallInputStyle(theme);
          break;
        default:
          break;
      }

      return inputStyle;
    };

    return (
      <Input
        css={getInputStyle()}
        key="search"
        prefix={SearchComponent.getPrefixIcon(theme)}
        clearIcon={clearIcon}
        isSecond={isSecond}
        {...rest}
        value={this.state.searchText}
        onChange={this.handleChangeState}
        onPressEnter={this.handlePressEnter}
      />
    );
  }
}

export const Search = withTheme(SearchComponent);
