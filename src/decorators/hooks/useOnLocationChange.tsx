import { useEffect } from "react";
import { Location, useLocation } from "react-router";

type TLocationChangeHandler = (location: Location) => void;

const useOnLocationChange = (onLocationChange: TLocationChangeHandler) => {
  const location = useLocation();

  useEffect(() => onLocationChange(location), [location, onLocationChange]);
};

export default useOnLocationChange;
