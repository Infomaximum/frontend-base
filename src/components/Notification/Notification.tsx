import Alert from "@im/base/src/components/Alert/Alert";
import { notificationErrorTestId } from "@im/base/src/utils/TestIds";
import type { INotificationProps } from "./Notification.types";
import { observer } from "mobx-react";
import { useContext } from "react";
import { DebugModeContext } from "@im/base/src/decorators/contexts/DebugModeContext";

const Notification = ({ error }: INotificationProps) => {
  const isDebugMode = useContext(DebugModeContext);

  if (!error || (!error.code && !error.message && !error.title)) {
    return null;
  }

  const message = error.message || error.title || error.code;
  const traceId = error.traceId;

  const testId = error.code
    ? `${notificationErrorTestId}_${error.code.toLowerCase().replace("_", "-")}`
    : notificationErrorTestId;

  return (
    <div key="notification-component-wrapper" test-id={testId}>
      <Alert
        key="notification-component"
        type="error"
        showIcon={true}
        message={error.message ? error.title : undefined}
        description={isDebugMode && traceId ? `${message} [${traceId}]` : message}
      />
    </div>
  );
};

export default observer(Notification);
