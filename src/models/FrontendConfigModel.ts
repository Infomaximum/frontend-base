import { Model } from "@im/utils";

class FrontendConfigModel extends Model {
  public static override get typename() {
    return "app_config_frontend";
  }

  public get isDocsAvailability(): boolean {
    return this.getBoolField("docs_availability");
  }

  public get isServiceModeEnabled(): boolean {
    return this.getBoolField("service_mode_info.enabled");
  }

  public get serviceModeMessage(): string | undefined {
    return this.getStringField("service_mode_info.message");
  }

  public get isUseUnsupportedApplications(): boolean {
    return this.getBoolField("use_unsupported_applications");
  }

  public override getInnerName() {
    return "frontend_config";
  }
}

export default FrontendConfigModel;
