import { useCallback, useMemo, useState, type FC } from "react";
import { Tour as AntTour } from "antd";
import { Global } from "@emotion/react";
import { nextButtonChildrenStyle, tourGlobalStyle } from "./Tour.styles";
import type { ITourComponentProps } from "./Tour.types";
import { useLocalization } from "../../decorators";
import { ArrowLeftOutlined } from "../Icons/Icons";
import { FINISH_TOUR, NEXT } from "../../utils";

const TourComponent: FC<ITourComponentProps> = ({
  steps,
  disabledInteraction = true,
  gap: gapProp,
  ...restProps
}) => {
  const localization = useLocalization();
  const [gap, setGap] = useState(gapProp);

  const handleChange = useCallback(
    (current: number) => {
      const currentStepGap = steps?.[current]?.gap;

      currentStepGap && setGap(currentStepGap);
    },
    [steps]
  );

  const preparedSteps = useMemo(
    () =>
      steps.map((step, index) => {
        return {
          ...step,
          nextButtonProps: {
            children:
              index === steps.length - 1 ? (
                localization.getLocalized(FINISH_TOUR)
              ) : (
                <div css={nextButtonChildrenStyle}>
                  {localization.getLocalized(NEXT)}
                  <ArrowLeftOutlined width={14} height={14} />
                </div>
              ),
          },
        };
      }),
    [localization, steps]
  );

  return (
    <>
      <AntTour
        steps={preparedSteps}
        disabledInteraction={disabledInteraction}
        gap={gap}
        onChange={handleChange}
        {...restProps}
      />
      <Global styles={tourGlobalStyle} />
    </>
  );
};

export const Tour = TourComponent;
