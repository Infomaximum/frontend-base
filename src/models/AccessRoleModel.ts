import { Model } from "@im/utils";
import type PrivilegeModel from "./PrivilegeModel";
import typenameToModel from "@im/base/src/models/typenameToModel";

class AccessRoleModel extends Model {
  public static override get typename() {
    return ["access_role"];
  }

  /**
   * Возвращает количество сотрудников, имеющих данную роль доступа
   * @returns {number | undefined} количество сотрудников
   */
  public getEmployeeCount(): number | undefined {
    return this.getNumberField("employee_count");
  }

  /**
   * Возвращает состояние статуса "Только для чтения"
   * @returns {boolean} статус роли доступа
   */
  public getReadOnlyStatus(): boolean {
    return this.getBoolField("read_only");
  }

  /**
   * Возвращает массив доступных привилегий роли доступа
   * @returns {Array<PrivilegeModel>} привилегии
   */
  public getPrivileges(): PrivilegeModel[] {
    return this.getListField<PrivilegeModel>("privileges", typenameToModel);
  }

  /**
   * возвращает флаг видимости элемента
   * @returns {boolean} флаг
   */
  public isHidden() {
    return this.getBoolField("hidden");
  }
}

export default AccessRoleModel;
