import type { MutableRefObject, ReactNode, RefObject } from "react";
import type { TContextMenuParamItem } from "../ContextMenu/ContextMenu.types";

export interface IContextMenuController {
  closeContextMenu: () => void;
}

export type TContextMenuControllerRef = MutableRefObject<IContextMenuController | null>;

export interface ICardEntity {
  getId(): number | string;
  getName(): string | undefined;
  getDescription?(): string | undefined;
  isFavourite?: boolean;
  contentTypename: string | undefined;
}

export interface IApplicationCardProps {
  entity: ICardEntity;
  onClick?: (entity: ICardEntity) => void;
  contextMenuGetter?(entity: ICardEntity): TContextMenuParamItem[];
  subMenuCloseDelay?: number;
  onRemove?(entity: ICardEntity): void;
  pathname?: string;
  mainPageContentRef?: RefObject<HTMLDivElement>;
  numberOfTitleLines?: number;
  additionalFooter?: ReactNode;
  isReadOnly?: boolean;
  isDisabled?: boolean;
  hasDeleteAccess?: boolean;
  isDeleteDisabled?: boolean;
  contextMenuControllerRef?: TContextMenuControllerRef;
}
