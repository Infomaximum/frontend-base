import { isArray, sortBy } from "lodash";
import type { ReactNode } from "react";

export function sortByTitle<T extends { title?: string | ReactNode }[]>(
  objects: T
) {
  if (!isArray(objects)) {
    return objects;
  }

  return sortBy(objects, "title") as T;
}
