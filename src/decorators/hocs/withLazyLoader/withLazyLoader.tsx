import type { ComponentType } from "react";
import { lazy, Suspense } from "react";
import Spinner from "src/components/Spinner/Spinner";

const spinner = <Spinner />;

const withLazyLoader = <
  T extends () => Promise<{ default: ComponentType<any> }>
>(
  Component: T
) => {
  const LazyComponent = lazy(Component);

  type TLazy = T extends () => Promise<{ default: infer C }>
    ? C extends ComponentType<infer P>
      ? [C, P]
      : never
    : never;

  const LComponent: TLazy[0] = (props: TLazy[1]) => (
    <Suspense fallback={spinner}>
      <LazyComponent {...props} />
    </Suspense>
  );

  return LComponent;
};

export default withLazyLoader;
