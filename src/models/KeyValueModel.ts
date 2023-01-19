import { Model } from "@im/utils";

class KeyValueModel extends Model {
  public static override get typename() {
    return "out_key_value";
  }

  /**
   * Возвращает ключ
   */
  public getKey(): string | undefined {
    return this.getStringField("key");
  }

  /**
   * Возвращает значение
   */
  public getValue(): string | undefined {
    return this.getStringField("value");
  }
}

export default KeyValueModel;
