import { InvalidIndex, Model, TTypenameStatic } from "@im/utils";

export const AUTHENTICATION_INTEGRATED_TYPE = "com.infomaximum.subsystem.core.integrated" as string;

class AuthenticationTypeModel extends Model {
  public static override get typename(): TTypenameStatic {
    return "authentication_type";
  }

  public override getId(): number {
    return InvalidIndex;
  }

  public get value() {
    return this.getStringField("value");
  }

  public get isIntegratedType() {
    return this.value === AUTHENTICATION_INTEGRATED_TYPE;
  }

  public override getInnerName(): string {
    return `${this.getDisplayName()}_${this.value}`;
  }
}

export default AuthenticationTypeModel;
