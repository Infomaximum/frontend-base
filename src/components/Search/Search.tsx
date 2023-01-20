import React from "react";
import type { ISearchProps, ISearchState } from "./Search.types";
import Input from "@im/base/src/components/Input/Input";
import { isString, isFunction } from "lodash";
import { KeyupRequestInterval } from "@im/base/src/utils/const";
import { SearchOutlined } from "@im/base/src/components/Icons/Icons";
import { iconStyle, searchMiddleInputStyle, searchSmallInputStyle } from "./Search.style";
import type { Interpolation } from "@emotion/react";

class Search extends React.PureComponent<ISearchProps, ISearchState> {
  public static defaultProps = {
    allowClear: true,
    size: "middle",
  };

  private static prefixIcon = (<SearchOutlined key="search-icon" css={iconStyle} />);

  private timer: NodeJS.Timer | undefined;

  constructor(props: ISearchProps) {
    super(props);

    this.timer = undefined;

    this.state = {
      searchText: props.value ?? undefined,
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

  private handleChangeState = (e: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({
      searchText: e.target.value,
    });
  };

  private handleChange = () => {
    const { searchText } = this.state;
    const { onChange } = this.props;

    this.timer && clearTimeout(this.timer);

    this.timer = setTimeout(() => {
      if (isString(searchText) && isFunction(onChange)) {
        onChange?.(searchText);
      }
    }, KeyupRequestInterval);
  };

  public override render() {
    const { onChange, value, size, ...rest } = this.props;

    let inputStyle: Interpolation<TTheme>;

    switch (size) {
      case "middle":
        inputStyle = searchMiddleInputStyle;
        break;
      case "small":
        inputStyle = searchSmallInputStyle;
        break;
      default:
        break;
    }

    return (
      <Input
        css={inputStyle}
        key="search"
        prefix={Search.prefixIcon}
        {...rest}
        value={this.state.searchText}
        onChange={this.handleChangeState}
      />
    );
  }
}

export default Search;
