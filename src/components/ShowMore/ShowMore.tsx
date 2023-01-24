import React from "react";
import { ArrowDownOutlined } from "src/components/Icons/Icons";
import Button from "src/components/Button/Button";
import withLoc from "src/decorators/hocs/withLoc/withLoc";
import { SHOW_MORE } from "src/utils/Localization/Localization";
import type { IShowMoreProps } from "./ShowMore.types";
import { tableShowMoreButtonTestId } from "src/utils/TestIds";
import { buttonStyle, ghostButtonStyle } from "./ShowMore.styles";
import { observer } from "mobx-react";

class ShowMore extends React.PureComponent<IShowMoreProps> {
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
    const { model, localization, mode } = this.props;

    const nextCountValue = model.getNextCount();
    const showMoreCaption = nextCountValue
      ? `${localization.getLocalized(SHOW_MORE)} (${nextCountValue})`
      : localization.getLocalized(SHOW_MORE);

    return (
      <Button
        type="link"
        onClick={this.handleClick}
        css={mode === "ghost" ? ghostButtonStyle : buttonStyle}
        test-id={tableShowMoreButtonTestId}
      >
        <ArrowDownOutlined key="icon" />
        {showMoreCaption}
      </Button>
    );
  }
}

export default withLoc(observer(ShowMore));
