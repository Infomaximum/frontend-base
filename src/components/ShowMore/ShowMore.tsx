import React from "react";
import { ArrowDownOutlined } from "../Icons/Icons";
import { Button } from "../Button/Button";
import { withLoc } from "../../decorators/hocs/withLoc/withLoc";
import { SHOW_MORE } from "../../utils/Localization/Localization";
import type { IShowMoreProps } from "./ShowMore.types";
import { tableShowMoreButtonTestId } from "../../utils/TestIds";
import { buttonStyle, ghostButtonStyle } from "./ShowMore.styles";
import { observer } from "mobx-react";
import { withTheme } from "../../decorators/hocs/withTheme/withTheme";
import { isNumber } from "lodash";
import { ShowMoreSpinner } from "./ShowMoreSpinner";

class ShowMoreComponent extends React.PureComponent<IShowMoreProps> {
  public static defaultProps = {
    mode: "link",
  } as const;

  private handleClick = () => {
    const { tableStore } = this.props;

    tableStore.setShowMore({
      limitsName: this.props.limitStateName,
      nodeId: this.props.model.getId(),
      variables: this.props.queryVariables,
      pages: 5,
    });
  };

  public override render(): React.ReactNode {
    const { localization, mode, theme } = this.props;
    const count = this.props.tableStore.model?.getItems().length;

    if (mode === "scrolling" && isNumber(count)) {
      return <ShowMoreSpinner />;
    }

    return (
      <Button
        type="link"
        onClick={this.handleClick}
        css={mode === "ghost" ? ghostButtonStyle(theme) : buttonStyle}
        test-id={tableShowMoreButtonTestId}
      >
        <ArrowDownOutlined key="icon" />
        {localization.getLocalized(SHOW_MORE)}
      </Button>
    );
  }
}

export const ShowMore = withLoc(withTheme(observer(ShowMoreComponent)));
