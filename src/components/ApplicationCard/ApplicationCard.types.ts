import type { IContextMenuParam } from "src/components/ContextMenu/ContextMenu.types";
import type { ITagProps } from "./InlineTags/InlineTags.types";

export interface ICardEntity {
  getId(): number;
  getName(): string | undefined;
  contentTypename: string | undefined;
  tags: ITagProps[];
}

export interface IApplicationCardProps {
  entity: ICardEntity;
  onClick?: (entity: ICardEntity) => void;
  contextMenuGetter?(entity: ICardEntity): IContextMenuParam[];
  measuredWidth: number;
  onRemove?(entity: ICardEntity): void;
  pathname?: string;
  isReadOnly?: boolean;
  hasDeleteAccess?: boolean;
}
