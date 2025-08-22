import type { ComponentType, PropsWithRef } from "react";
import { lazy, Suspense } from "react";
import { SystemLoaderProvider } from "@infomaximum/base/src/managers/SystemLoaderProvider";

type TModuleWithDefaultExport<P = any> = { default: ComponentType<P> };
type TModuleWithoutDefaultExport = {};
type TModule<P = any> = { default?: ComponentType<P> };

type TRemoveDefault<M extends TModule> = {
  [K in keyof M as K extends "default" ? never : K]: M[K];
};

type TRemoveNonComponentType<M extends TModule> = {
  [K in keyof M as M[K] extends ComponentType ? K : never]: M[K];
};

type TResolver<M extends TModule<P>, P = any> = (
  module: TRemoveNonComponentType<TRemoveDefault<M>>
) => ComponentType<P>;

/**
 *
 * @param loader - функция возвращающая динамически импортированный модуль
 * @param resolver - резолвер нужного компонента
 *
 * @example
 * const Page404 = withLazyLoader(
  () => import("../components/Page404/Page404"),
  (c) => c.Page404
 */
export function withLazyLoader<
  M extends TModuleWithoutDefaultExport,
  Resolver extends TResolver<M>,
>(loader: () => Promise<M>, resolver: Resolver): ReturnType<Resolver>;
export function withLazyLoader<M extends TModuleWithDefaultExport>(
  loader: () => Promise<M>
): M["default"];

export function withLazyLoader<M extends TModule, Resolver extends TResolver<M>>(
  loader: () => Promise<M>,
  resolver?: Resolver
): ReturnType<Resolver> {
  const LazyComponent = lazy(() =>
    loader().then((m) => ({
      default: resolver ? resolver(m) : m.default!,
    }))
  );

  const Component = (props: JSX.IntrinsicAttributes & PropsWithRef<unknown>) => (
    <SystemLoaderProvider>
      <Suspense>
        <LazyComponent {...props} />
      </Suspense>
    </SystemLoaderProvider>
  );

  return Component as ReturnType<Resolver>;
}
