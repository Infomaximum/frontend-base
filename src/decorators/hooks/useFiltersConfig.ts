import { useContext } from "react";
import { FiltersContext, type IFiltersContext } from "../contexts/FiltersContext";

export const useFiltersConfig = () => {
  const filtersConfig = useContext<IFiltersContext>(FiltersContext);

  return filtersConfig;
};
