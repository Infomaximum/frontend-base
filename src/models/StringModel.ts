import { Model } from "@im/utils";

/**
 * typename - заглушка для элемента StringModel
 */
export const stringItemFakeTypename = "string_item";

/**
 * Модель строки, нужна для обобщенной работы с моделями в Store
 */
class StringModel extends Model {
  public static override get typename() {
    return stringItemFakeTypename;
  }

  /**
   * Возвращает строку которая приходит с сервера
   */
  public getContent(): string | undefined {
    return this.getStringField("content");
  }

  /**
   * Для innerName используется значение строки, т.к. оно должно быть уникальным для StringModel
   */
  public override getInnerName(): string {
    return this.getContent() || stringItemFakeTypename;
  }
}

export default StringModel;
