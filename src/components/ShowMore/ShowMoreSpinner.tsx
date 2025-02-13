import { Spin } from "antd";
import { spinContainerStyle, spinStyle } from "./ShowMore.styles";
import { LOADING_ON_SCROLL_SPINNER_ID } from "../../utils";

export const ShowMoreSpinner = () => (
  <div id={LOADING_ON_SCROLL_SPINNER_ID} css={spinContainerStyle}>
    <Spin css={spinStyle} size="small" />
  </div>
);
