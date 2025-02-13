import { Group, type IGroup } from "@infomaximum/graphql-model";

export interface IPagingGroup extends IGroup {
  hasNext: boolean;
}

export abstract class PagingGroup extends Group implements IPagingGroup {
  public abstract get hasNext(): boolean;
}
