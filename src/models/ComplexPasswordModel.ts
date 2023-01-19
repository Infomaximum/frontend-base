import { Model } from "@im/utils";

class ComplexPasswordModel extends Model {
  public static override get typename() {
    return "complex_password_output";
  }

  public getMinPasswordLength(): number | undefined {
    return this.getNumberField("min_password_length");
  }
}

export default ComplexPasswordModel;
