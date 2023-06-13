import { assertSimple } from "@infomaximum/assert";

export function boundMethod<This, Args extends any[], Return>(
  target: (this: This, ...args: Args) => Return,
  context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>
) {
  assertSimple(typeof target === "function", "'boundMethod' может обработать только метод.");

  const methodName = context.name as keyof This;

  type TMethod = typeof target;

  context.addInitializer(function () {
    (this[methodName] as TMethod) = (this[methodName] as TMethod).bind(this);
  });
}
