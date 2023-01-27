import { Alert } from "../Alert/Alert";
import { notificationErrorTestId } from "../../utils/TestIds";
import type { INotificationProps } from "./Notification.types";
import { observer } from "mobx-react";
import { FC, useContext } from "react";
import { DebugModeContext } from "../../decorators/contexts/DebugModeContext";

const NotificationComponent: FC<INotificationProps> = ({ error }) => {
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
        description={
          isDebugMode && traceId ? `${message} [${traceId}]` : message
        }
      />
    </div>
  );
};

export const Notification = observer(NotificationComponent);
