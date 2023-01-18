import { settingsKey } from "@im/platform/src/utils/Routes/keys";
import type { NCore } from "@im/core";
// import withLazyLoader from "@im/platform/src/decorators/hocs/withLazyLoader/withLazyLoader";

/* 
const ExampleComponent = withLazyLoader(() =>
  import("../containers/ExampleComponent")
); 
*/

export const getBaseRoutes: NCore.TRoutesFunc = () => [
  {
    key: settingsKey,        
    routes: [],
  },
];
