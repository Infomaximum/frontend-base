import { PureComponent } from "react";
import { Layout } from "antd";
import {
  layoutStyle,
  unAuthorizedContentStyle,
  wrapperContentLoginStyle,
  animationContentLoginStyle,
  headStyle,
  iconBack,
  backLink,
  formBodyDefaultStyle,
  companyNameStyle,
} from "./UnAuthorizedLayout.styles";
import { NavLink } from "react-router-dom";
import { unAuthorizedLayoutBackNavLinkTestId } from "../../utils/TestIds";
import { EErrorBoundaryCodesBase } from "../../utils/const";
import type {
  IUnAuthorizedLayoutDefaultProps,
  IUnAuthorizedLayoutProps,
  IUnAuthorizedLayoutState,
} from "./UnAuthorizedLayout.types";
import { observer } from "mobx-react";
import { LOG_IN } from "../../utils/Localization/Localization";
import { ArrowLeftOutlined } from "../../components/Icons/Icons";
import { ErrorBoundary } from "../../components/ErrorBoundary";
import { BaseCard } from "../../components/BaseCard";
import { withLoc, withSystemTitle, withTheme } from "../../decorators/hocs";
import { CompanyNameSVG } from "../../resources/icons";

const { Content } = Layout;

class UnAuthorized extends PureComponent<
  IUnAuthorizedLayoutProps,
  IUnAuthorizedLayoutState
> {
  public static getDerivedStateFromProps(
    nextProps: Partial<IUnAuthorizedLayoutProps>,
    prevState = {} as IUnAuthorizedLayoutState
  ) {
    let showAnimate = prevState.showAnimate;

    if (
      prevState.error !== undefined &&
      nextProps.error !== undefined &&
      nextProps.error !== prevState.error
    ) {
      showAnimate = true;
    }

    return {
      showAnimate,
      error: nextProps.error,
    };
  }

  public static defaultProps: IUnAuthorizedLayoutDefaultProps = {
    bodyStyle: formBodyDefaultStyle,
  };

  constructor(props: IUnAuthorizedLayoutProps) {
    super(props);

    this.state = { showAnimate: false };
  }

  public override componentDidMount() {
    const { localization, route, productNameLoc } = this.props;

    const localizations: string[] = [];

    if (route?.systemTitleLoc) {
      localizations.push(localization.getLocalized(route.systemTitleLoc));
    } else {
      localizations.push(localization.getLocalized(LOG_IN));
    }

    if (productNameLoc) {
      localizations.push(localization.getLocalized(productNameLoc));
    }

    this.props.buildSystemTitle(localizations);
  }

  public handleAnimationComplete = () => {
    this.setState({ showAnimate: false });
  };

  private getHeaderTitle() {
    const { title, backUrl, theme } = this.props;

    if (title) {
      return backUrl ? (
        <>
          <NavLink
            key="link-back"
            to={backUrl}
            css={backLink}
            test-id={unAuthorizedLayoutBackNavLinkTestId}
          >
            <ArrowLeftOutlined style={iconBack(theme)} />
          </NavLink>
          {title}
        </>
      ) : (
        title
      );
    }

    return null;
  }

  public override render() {
    const { showAnimate } = this.state;

    const wrapperContentStyles = [
      wrapperContentLoginStyle,
      showAnimate ? animationContentLoginStyle : {},
    ];

    return (
      <Layout css={layoutStyle}>
        <ErrorBoundary code={EErrorBoundaryCodesBase.unAuthorizedLayout}>
          {this.props.topPanel}
          <Content css={unAuthorizedContentStyle}>
            <div css={companyNameStyle}>
              <CompanyNameSVG />
            </div>
            <BaseCard
              styleWrapper={[wrapperContentStyles, this.props.wrapperStyle]}
              headStyle={headStyle}
              bodyStyle={this.props.bodyStyle}
              title={this.getHeaderTitle()}
              onAnimationEnd={this.handleAnimationComplete}
            >
              {this.props.children}
            </BaseCard>
          </Content>
        </ErrorBoundary>
      </Layout>
    );
  }
}

export const UnAuthorizedLayout = withSystemTitle()(
  withTheme(withLoc(observer(UnAuthorized)))
);
