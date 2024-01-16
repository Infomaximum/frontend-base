/* eslint-disable @typescript-eslint/ban-types */
import type { ComponentType } from "react";
import { lazy, Suspense } from "react";
import { Spinner } from "../../../components/Spinner/Spinner";

const spinner = <Spinner />;

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
  Resolver extends TResolver<M>
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
      default: resolver ? resolver(m) : m["default"]!,
    }))
  );

  const Component = (props: any) => (
    <Suspense fallback={spinner}>
      <LazyComponent {...props} />
    </Suspense>
  );

  return Component as ReturnType<Resolver>;
}
