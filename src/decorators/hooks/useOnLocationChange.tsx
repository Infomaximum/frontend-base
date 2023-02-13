import { useEffect } from "react";
import { Location, useLocation } from "react-router";

type TLocationChangeHandler = (location: Location) => void;

export const useOnLocationChange = (
  onLocationChange: TLocationChangeHandler
) => {
  const location = useLocation();

  useEffect(() => onLocationChange(location), [location, onLocationChange]);
};
