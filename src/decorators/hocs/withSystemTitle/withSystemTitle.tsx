import { PureComponent } from "react";
import hoistNonReactStatics from "hoist-non-react-statics";
import { getBreadcrumbs } from "../../../utils/Routes/routes";
import { withLoc } from "../../../decorators/hocs/withLoc/withLoc";
import { compact, isArray } from "lodash";
import type { TPropInjector } from "@infomaximum/utility";
import type {
  IWithSystemTitleProps,
  IWithSystemTitleState,
  TParams,
} from "./withSystemTitle.types";
import { observer } from "mobx-react";
import { withLocation } from "../withLocation/withLocation";
import { matchPath } from "react-router-dom";

export const withSystemTitle = (
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

      public static getDerivedStateFromProps(props: any, state: IWithSystemTitleState) {
        if (!state.isCustomTitle) {
          const crumbs = getBreadcrumbs(props.location.pathname, "systemTitleLoc");

          const locationRouteElement = crumbs?.[crumbs.length - 1];
          if (locationRouteElement?.isLayoutRoute) {
            return state;
          }

          let titleElementsCount = crumbs.length;

          const pathPattern = locationRouteElement?.path;

          if (pathPattern) {
            const matchingPath = matchPath(pathPattern, props.location.pathname);

            // Если путь соответствует паттерну, то смотрим уже на ожидаемое и действительное кол-во элементов пути.
            // Иначе путь не соответствует и нам не нужно менять заголовок вкладки вообще, ибо вызов произошел "где-то между"
            if (matchingPath) {
              titleElementsCount += Object.keys(matchingPath.params).length;
            } else {
              return state;
            }
          }

          const modelForDisplayName = (store ?? props)?.model;
          const modelDisplayName = modelForDisplayName
            ? modelForDisplayName.getDisplayName() || " "
            : "";

          let systemTitleElements = [];

          for (let i = crumbs.length - 1; i >= 0; i--) {
            const crumb = crumbs[i];

            if (i === crumbs.length - 1 && crumb) {
              systemTitleElements.push(props.localization.getLocalized(crumb.systemTitleLoc));
              continue;
            }

            if (crumb) {
              systemTitleElements.push(props.localization.getLocalized(crumb.systemTitleLoc));
            }
          }

          if (titleLocList && isArray(titleLocList)) {
            systemTitleElements = [];

            for (let i = 0; i < titleLocList.length; i++) {
              if (i === 0) {
                systemTitleElements.push(props.localization.getLocalized(titleLocList[i]));
                continue;
              }

              systemTitleElements.push(props.localization.getLocalized(titleLocList[i]));
            }
          }

          if ((displayModelNameInTitle || store) && !!modelDisplayName.length) {
            systemTitleElements.unshift(modelDisplayName);
          }

          const compactSystemTitleElements = compact(systemTitleElements);

          if (compactSystemTitleElements.length >= titleElementsCount) {
            const newTitle = compactSystemTitleElements.join(" - ");
            if (newTitle && newTitle !== document.title) {
              document.title = newTitle;
            }
          }
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
