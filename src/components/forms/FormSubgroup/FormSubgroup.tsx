import { memo, type FC } from "react";
import type { IFormGroupProps } from "./FormSubgroup.types";
import React from "react";

/**
 * Компонент обёртка, использующийся для отображения контента внутри в отдельной группе внутри формы.
 * Должен находится на верхнем уровне children либо внутри React.Fragment
 *
 * @examples
 * Базовый случай
 * <Form>
 *   <FormSubgroup>
 *     {children}
 *   </FormSubgroup>
 * </Form>
 *
 * Случай использования без обёртки в FormSubgroup.
 * Контент внутри FormSubgroup отображается в отдельной группе, всё остальное - в контейнере,
 * который отображается в самом начале.
 * <Form>
 *   <InputFormField ... />
 *   <InputFormField ... />
 *   <div>...</div>
 *   <FormSubgroup>
 *     {children}
 *   </FormSubgroup>
 *   <FormSubgroup>
 *     {children}
 *   </FormSubgroup>
 * </Form>
 *
 * При переданном пропсе priority идёт сортировка по убыванию
 * <Form>
 *   <InputFormField ... />
 *   <InputFormField ... />
 *   <div>...</div>
 *   <FormSubgroup priority={200}>
 *     {children}
 *   </FormSubgroup>
 *   <FormSubgroup>
 *     {children}
 *   </FormSubgroup>
 *   <FormSubgroup priority={300}>
 *     {children}
 *   </FormSubgroup>
 * </Form>
 *
 * Если не использовать FormSubgroup, то Form ведёт себя стандартным образом
 * <Form>
 *   <InputFormField ... />
 *   <InputFormField ... />
 *   <div>...</div>
 * </Form>
 *
 */

const FormSubgroupComponent: FC<IFormGroupProps> = ({ children }) => {
  return <>{children}</>;
};

export const FormSubgroup = memo(FormSubgroupComponent);
