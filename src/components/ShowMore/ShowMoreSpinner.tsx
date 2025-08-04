import { spinContainerStyle } from "./ShowMore.styles";
import { LOADING_ON_SCROLL_SPINNER_ID } from "../../utils";
import { LocalSpinner } from "../Spinner";

export const ShowMoreSpinner = () => (
  <div id={LOADING_ON_SCROLL_SPINNER_ID} css={spinContainerStyle}>
    <LocalSpinner />
  </div>
);
