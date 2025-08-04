import type { TourProps, TourStepProps } from "antd";
export interface ITourStep extends TourStepProps {
  gap?: TourProps["gap"];
}

export interface ITourComponentProps extends Omit<TourProps, "steps"> {
  steps: ITourStep[];
}
