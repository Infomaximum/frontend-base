import { Model } from "@im/utils";
import type AuthenticationTypeModel from "./AuthenticationTypeModel";
import type IntegratedAuthenticationModel from "./IntegratedAuthenticationModel";
import typenameToModel from "@im/base/src/models/typenameToModel";

class AuthenticationModel extends Model {
  public static override get typename() {
    return "authentication";
  }

  public getType(): AuthenticationTypeModel | undefined {
    return this.getModelField<AuthenticationTypeModel>("type", typenameToModel);
  }

  public getContent() {
    return this.getModelField<IntegratedAuthenticationModel>("content", typenameToModel);
  }

  /** Количество сотрудников которым назначена эта аутентификация */
  public getEmployeeCount() {
    return this.getNumberField("employee_count.count");
  }

  /** Общее количество сотрудников (которое было отправлено на сервер) */
  public getEmployeeTotalCount() {
    return this.getNumberField("employee_count.total");
  }

  public isHidden(): boolean {
    return this.getBoolField("hidden");
  }
}

export default AuthenticationModel;
