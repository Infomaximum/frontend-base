export interface IBreadcrumb {
  key: string;
  name: string;
  path: string;
}

export interface IBreadcrumbsProps {
  items: IBreadcrumb[];
  visibleCount: number;
  homePath: string;

  homeTitle?: string;
  showMoreTitle?: string;
}
