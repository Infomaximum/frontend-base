import type { ReactNode } from "react";

export interface IBreadcrumb<T = unknown> {
  key: string;
  name: string | ReactNode;
  onClick?(data?: T): void;
}

export interface IBreadcrumbsProps {
  items: IBreadcrumb[];
  visibleCount: number;
  contentAfterBreadcrumbs?: ReactNode;
  visibleCountWithLevels?: number;
  maxAvailableContainerWidth?: number;
  onHomeClick?(): void;
  crumbFontSize?: number;
  homeTitle?: string;
  showMoreTitle?: string;
  ["test-id"]?: string;
}
