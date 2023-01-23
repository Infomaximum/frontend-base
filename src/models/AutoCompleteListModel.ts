import type { Model } from "@im/utils";
import { Group } from "@im/utils";
import typenameToModel from "src/models/typenameToModel";

/**
 * Модель автокомплита
 */
class AutoCompleteListModel<M extends Model = Model> extends Group {
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

export default AutoCompleteListModel;
