import { difference } from "lodash";

export const symmetricDifference = (firstArray: unknown[], secondArray: unknown[]) =>
  difference(firstArray, secondArray).concat(difference(secondArray, firstArray));
