import { Segmented as AntSegmented } from "antd";
import type { ISegmentedProps } from "./Segmented.types";

const SegmentedComponent: React.FC<ISegmentedProps> = (props) => {
  return <AntSegmented {...props} />;
};

export const Segmented = SegmentedComponent;
