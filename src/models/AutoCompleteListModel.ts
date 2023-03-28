import { Group, type Model } from "@infomaximum/graphql-model";
import { typenameToModel } from "./typenameToModel";

/**
 * Модель автокомплита
 */
export class AutoCompleteListModel<M extends Model = Model> extends Group {
  public static override get typename(): null {
    return null;
  }

  /**
   * Возвращает список для автокомплита
   */
  public getItems(): M[] {
    return this.getListField<M>("items", typenameToModel);
  }

  public getNextCount(): number {
    return this.getNumberField("next_count") || 0;
  }
}
