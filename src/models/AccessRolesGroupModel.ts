import { Group, InvalidIndex } from "@im/utils";
import type AccessRoleModel from "./AccessRoleModel";
import typenameToModel from "@im/base/src/models/typenameToModel";
import type RestModel from "@im/base/src/models/RestModel";

type TItems = AccessRoleModel | RestModel;

class AccessRolesGroupModel extends Group {
  public static override get typename() {
    /* todo: Дмитрий Кусков: разные typename для одинаковых сущностей, причем в одной из сущностей 
       есть element, а в другой нет.
    */
    return ["access_role_list_result", "access_role_collection"];
  }

  public override getId(): number {
    return InvalidIndex;
  }

  /**
   * Возвращает список Ролей доступа
   * @returns {Array<AccessRolesGroupModel | AccessRoleModel>} список ролей доступа
   */
  public getItems(): TItems[] {
    return this.getListField<TItems>("items", typenameToModel);
  }
}

export default AccessRolesGroupModel;
