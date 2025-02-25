import { configure } from "mobx";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import "dayjs/locale/en";

configure({
  enforceActions: "always",
  computedRequiresReaction: false,
  reactionRequiresObservable: false,
  observableRequiresReaction: false,
  disableErrorBoundaries: true,
});

// Определение пути, по которому лежат chunks динамических импортов
__webpack_public_path__ = `${window.im.system.apiPrefix ?? ""}/`;

import utc from "dayjs/plugin/utc";
import duration from "dayjs/plugin/duration";
import objectSupport from "dayjs/plugin/objectSupport";
import isoWeek from "dayjs/plugin/isoWeek";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isBetween from "dayjs/plugin/isBetween";
import LocalizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(utc);
dayjs.extend(duration);
dayjs.extend(objectSupport);
dayjs.extend(isoWeek);
dayjs.extend(isSameOrBefore);
dayjs.extend(isBetween);
dayjs.extend(LocalizedFormat);
