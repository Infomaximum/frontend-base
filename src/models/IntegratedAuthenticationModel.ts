import typenameToModel from "@im/base/src/models/typenameToModel";
import { Model, MillisecondsPerDay } from "@im/utils";
import type ComplexPasswordModel from "./ComplexPasswordModel";

class IntegratedAuthenticationModel extends Model {
  public static override get typename() {
    return "integrated_authentication_content";
  }

  public getMaxInvalidLogonCountEnabled(): boolean {
    return !!this.getMaxInvalidLogonCount();
  }

  public getMaxInvalidLogonCount(): number | undefined {
    return this.getNumberField("max_invalid_logon_count");
  }

  public getPasswordExpirationTimeEnabled(): boolean {
    return !!this.getPasswordExpirationTime();
  }

  public getPasswordExpirationTime(): number | undefined {
    const passwordExpirationTime = this.getStringField("password_expiration_time");

    if (passwordExpirationTime) {
      return Number(passwordExpirationTime) / MillisecondsPerDay;
    }
  }

  public getComplexPasswordEnabled(): boolean {
    return !!this.struct.complex_password;
  }

  public getComplexPassword(): ComplexPasswordModel | undefined {
    return this.getModelField<ComplexPasswordModel>("complex_password", typenameToModel);
  }
}

export default IntegratedAuthenticationModel;
