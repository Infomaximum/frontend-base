import { Model } from "@im/utils";

class ActiveSubsystemModel extends Model {
  public static override get typename() {
    return "subsystem";
  }

  /**
   * Возвращает имя модели
   * @returns string
   */
  public getUuid(): string | undefined {
    return this.getStringField("uuid");
  }
  /**
   * Возвращает версию модели
   * @returns string
   */
  public getVersion(): string | undefined {
    return this.getStringField("version");
  }
}

export default ActiveSubsystemModel;
