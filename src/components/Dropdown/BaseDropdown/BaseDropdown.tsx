import React, { createContext } from "react";
import { Dropdown } from "../Dropdown";
import type { IBaseDropdownProps, IBaseDropdownState } from "./BaseDropdown.types";
import { menuStyle, mainBaseDropdownOverlayStyle } from "./BaseDropdown.styles";
import { DropdownAnimationInterval } from "../../../utils/const";
import { withTheme } from "../../../decorators";
import { cssStyleConversion } from "../../../styles";

export enum EBaseDropdownPlacement {
  bottomLeft = "bottomLeft",
  bottomRight = "bottomRight",
  bottom = "bottom",
  topLeft = "topLeft",
  top = "top",
  topRight = "topRight",
}

export const BaseDropdownContext = createContext(false);

class BaseDropdownComponent extends React.PureComponent<IBaseDropdownProps, IBaseDropdownState> {
  private readonly buttonRef: React.RefObject<HTMLElement> = React.createRef();
  private animationTimer: NodeJS.Timeout | null = null;

  public static defaultProps = {
    placement: EBaseDropdownPlacement.bottomLeft,
    overlayStyle: mainBaseDropdownOverlayStyle,
  };

  public override state = {
    isShowMenu: false,
    isShowChildren: true,
  };

  public override componentDidUpdate(
    prevProps: Readonly<IBaseDropdownProps>,
    prevState: Readonly<IBaseDropdownState>
  ): void {
    const { isShowMenu } = this.state;
    const { isManualHideMenu } = this.props;

    if (isManualHideMenu && !prevProps.isManualHideMenu && isShowMenu) {
      this.animationTimer = setTimeout(() => {
        this.setState({ isShowMenu: false });
        this.animationTimer && clearTimeout(this.animationTimer);
        document.body.removeEventListener("click", this.handleClickBody);
      }, DropdownAnimationInterval);
    }

    if (isShowMenu && !prevState.isShowMenu) {
      this.changeIsShowChildren(true);
    } else if (!isShowMenu && prevState.isShowMenu) {
      this.changeIsShowChildren(false);
    }
  }

  public override componentWillUnmount(): void {
    this.animationTimer && clearTimeout(this.animationTimer);
    document.body.removeEventListener("click", this.handleClickBody);
  }

  private changeIsShowChildren(value: boolean) {
    this.animationTimer && clearTimeout(this.animationTimer);
    this.animationTimer = setTimeout(() => {
      this.setState({ isShowChildren: value });
      this.props.onOpenChange?.(value);
    }, DropdownAnimationInterval);
  }

  private handleClickBody = (e: MouseEvent) => {
    const bodyNode = document.body;

    if (this.buttonRef.current?.contains(e.target as HTMLElement)) {
      bodyNode.removeEventListener("click", this.handleClickBody);
      return;
    }

    if ((e.target as HTMLElement).closest("#root")) {
      this.setState({ isShowMenu: false }, () => {
        bodyNode.removeEventListener("click", this.handleClickBody);
      });
    }
  };

  private handleClickButton = () => {
    const { isShowMenu } = this.state;

    this.setState({ isShowMenu: !isShowMenu }, () => {
      if (!isShowMenu) {
        document.body.addEventListener("click", this.handleClickBody);
      } else {
        this.buttonRef.current?.blur();
      }
    });
  };

  private handleShowMenu = (open: boolean) => {
    this.setState({ isShowMenu: open });
  };

  private get menu() {
    const { isShowMenu, isShowChildren } = this.state;
    const { theme, menuStyle: menuStyleProps } = this.props;

    return (
      <>
        <div key="wrapper-menu" css={cssStyleConversion(theme, [menuStyle, menuStyleProps])}>
          {isShowMenu || (!isShowMenu && isShowChildren) ? this.props.children : null}
        </div>
      </>
    );
  }

  public override render(): React.ReactNode {
    const { placement, button, overlayStyle, ...rest } = this.props;
    const { isShowMenu } = this.state;
    return (
      <BaseDropdownContext.Provider value={isShowMenu}>
        <Dropdown
          {...rest}
          open={isShowMenu}
          overlay={this.menu}
          trigger={["click"]}
          placement={placement}
          overlayStyle={overlayStyle}
          onOpenChange={this.handleShowMenu}
        >
          {React.cloneElement(button, {
            key: "clone-element_button",
            ref: this.buttonRef,
            onClick: this.handleClickButton,
          })}
        </Dropdown>
      </BaseDropdownContext.Provider>
    );
  }
}

export const BaseDropdown = withTheme(BaseDropdownComponent);
