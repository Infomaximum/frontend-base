import { Model } from "@im/utils";
import typenameToModel from "@im/base/src/models/typenameToModel";
import type ActiveSubsystemModel from "./ActiveSubsystemModel";

class ServerModel extends Model {
  public static override get typename() {
    return "server";
  }

  public static statusValues = {
    NOT_INIT: "NOT_INIT",
    ACTIVE: "ACTIVE",
  };

  /**
   * Возвращает список активных подсистем
   */
  public getActiveSubsystemModel(): ActiveSubsystemModel[] {
    return this.getListField<ActiveSubsystemModel>("active_subsystem", typenameToModel);
  }

  public getStatusServer(): string | undefined {
    return this.getStringField("status");
  }

  public override getInnerName() {
    return "server";
  }
}

export default ServerModel;
