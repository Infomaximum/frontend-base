import dayjs from "dayjs";

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
