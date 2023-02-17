import { PureComponent } from "react";
import hoistNonReactStatics from "hoist-non-react-statics";
import type { TPropInjector } from "@im/utils";

export interface IWithPseudoClassesProps {
  onMouseEnter: (...args: any) => void;
  onMouseLeave: (...args: any) => void;
  onMouseOver: (...args: any) => void;
  hover: boolean;
}

export interface IWithPseudoClassesState {
  hover: boolean;
}

/**
 * @param {React.ComponentType} Component
 * @returns {Function}
 */
export const withPseudoClasses: TPropInjector<IWithPseudoClassesProps> = (Component: any) => {
  const Class: any = class extends PureComponent<IWithPseudoClassesProps, IWithPseudoClassesState> {
    public override state = {} as IWithPseudoClassesState;

    constructor(props: IWithPseudoClassesProps) {
      super(props);

      this.handleMouseEnter = this.handleMouseEnter.bind(this);
      this.handleMouseLeave = this.handleMouseLeave.bind(this);
      this.handleMouseOver = this.handleMouseOver.bind(this);
    }

    public handleMouseEnter(...args: any[]) {
      if (this.props.onMouseEnter) {
        this.props.onMouseEnter(...args);
      }
      this.setState({ hover: true });
    }

    public handleMouseLeave(...args: any[]) {
      if (this.props.onMouseLeave) {
        this.props.onMouseLeave(...args);
      }
      this.setState({ hover: false });
    }

    public handleMouseOver(...args: any[]) {
      if (this.props.onMouseOver) {
        this.props.onMouseOver(...args);
      }
      this.setState({ hover: true });
    }

    public override render() {
      const additionalProps = {} as IWithPseudoClassesProps;

      additionalProps.hover = this.state && this.state.hover;
      additionalProps.onMouseEnter = this.handleMouseEnter;
      additionalProps.onMouseLeave = this.handleMouseLeave;
      additionalProps.onMouseOver = this.handleMouseOver;

      return <Component {...this.props} {...additionalProps} />;
    }
  };

  return hoistNonReactStatics(Class, Component);
};
