import type { ReactNode } from "react";

export interface IBreadcrumb {
  key: string;
  name: string | ReactNode;
  onClick?(): void;
}

export interface IBreadcrumbsProps {
  items: IBreadcrumb[];
  visibleCount: number;
  visibleCountWithLevels?: number;
  maxAvailableContainerWidth?: number;
  onHomeClick?(): void;
  crumbFontSize?: number;
  homeTitle?: string;
  showMoreTitle?: string;
  ["test-id"]?: string;
}
