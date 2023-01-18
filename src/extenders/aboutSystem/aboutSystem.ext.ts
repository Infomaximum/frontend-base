import { inject } from "@im/core";
import { AboutSystemExt } from "@im/platform/src/containers/AboutSystem/AboutSystemExt";
import { BASE } from "@im/base/src/utils/Localization/Localization";
import { BaseModule } from "@im/base/src/index.module";

class BaseAboutSystemExt {
  @inject private aboutSystemExt!: AboutSystemExt;

  constructor() {
    this.aboutSystemExt.setDescriptionSystemModule({ uuid: BaseModule.moduleName, loc: BASE });
  }
}

new BaseAboutSystemExt();
