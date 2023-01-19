import { Model } from "@im/utils";
import typenameToModel from "@im/base/src/models/typenameToModel";
import type PersonModel from "./PersonModel";

export const sessionModelTypename = "session";

class SessionModel extends Model {
  public static override get typename() {
    return sessionModelTypename;
  }

  public static statusValues = {
    NOT_INIT: "NOT_INIT",
    ACTIVE: "ACTIVE",
  };

  public getPerson<M extends PersonModel>(): M | undefined {
    return this.getModelField<M>("employee", typenameToModel);
  }
}

export default SessionModel;
