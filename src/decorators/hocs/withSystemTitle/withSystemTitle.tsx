import { PureComponent } from "react";
import hoistNonReactStatics from "hoist-non-react-statics";
import { getBreadcrumbs } from "../../../utils/Routes/routes";
import withLoc from "../../../decorators/hocs/withLoc/withLoc";
import { isArray } from "lodash";
import type { TPropInjector } from "@im/utils";
import type {
  IWithSystemTitleProps,
  IWithSystemTitleState,
  TParams,
} from "./withSystemTitle.types";
import { observer } from "mobx-react";
import withLocation from "../withLocation/withLocation";

const withSystemTitle = (
  params: TParams = {
    displayModelNameInTitle: false,
    titleLocList: undefined,
    store: undefined,
  }
): TPropInjector<IWithSystemTitleProps> => {
  const { displayModelNameInTitle, titleLocList, store } = params;

  return (Component: any) => {
    const WithSystemTitle = class extends PureComponent<any> {
      constructor(props: any) {
        super(props);
        this.state = { isCustomTitle: false };
        this.setCustomSystemTitle = this.setCustomSystemTitle.bind(this);
        this.buildSystemTitle = this.buildSystemTitle.bind(this);
      }

      public static getDerivedStateFromProps(
        props: any,
        state: IWithSystemTitleState
      ) {
        if (!state.isCustomTitle) {
          const crumbs = getBreadcrumbs(
            props.location.pathname,
            "systemTitleLoc"
          );

          const modelDisplayName =
            (store ?? props)?.model?.getDisplayName() ?? "";

          let systemTitle = "";

          for (let i = crumbs.length - 1; i >= 0; i--) {
            const crumb = crumbs[i];

            if (i === crumbs.length - 1 && crumb) {
              systemTitle += props.localization.getLocalized(
                crumb.systemTitleLoc
              );
              continue;
            }

            if (crumb) {
              systemTitle += ` - ${props.localization.getLocalized(
                crumb.systemTitleLoc
              )}`;
            }
          }

          if (titleLocList && isArray(titleLocList)) {
            systemTitle = "";

            for (let i = 0; i < titleLocList.length; i++) {
              if (i === 0) {
                systemTitle += props.localization.getLocalized(titleLocList[i]);
                continue;
              }

              systemTitle += ` - ${props.localization.getLocalized(
                titleLocList[i]
              )}`;
            }
          }

          if ((displayModelNameInTitle || store) && !!modelDisplayName.length) {
            systemTitle = `${modelDisplayName} - ${systemTitle}`;
          }

          document.title = systemTitle;
        }

        return state;
      }

      public setCustomSystemTitle(title: string): void {
        this.setState({ isCustomTitle: true });

        document.title = title;
      }

      public buildSystemTitle(titleList: string[]) {
        if (isArray(titleList)) {
          const title = titleList.filter(Boolean).join(" - ") || "";
          this.setCustomSystemTitle(title);
        }
      }

      public override render() {
        return (
          <Component
            {...this.props}
            setCustomSystemTitle={this.setCustomSystemTitle}
            buildSystemTitle={this.buildSystemTitle}
          />
        );
      }
    };

    return hoistNonReactStatics(
      withLoc(withLocation(observer(WithSystemTitle)) as any),
      Component
    ) as any;
  };
};

export default withSystemTitle;
