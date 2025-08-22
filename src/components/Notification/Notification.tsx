import { Alert } from "@infomaximum/ui-kit";
import { notificationErrorTestId } from "@infomaximum/base/src/utils/TestIds";
import type { INotificationProps } from "./Notification.types";
import { observer } from "mobx-react";
import { type FC, useContext } from "react";
import { DebugModeContext } from "@infomaximum/base/src/decorators/contexts/DebugModeContext";

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

  const messageTitle = error.message ? error.title : undefined;
  const messageDescription = isDebugMode && traceId ? `${message} [${traceId}]` : message;

  const combinedMessage = (
    <>
      {messageTitle}
      {messageTitle && messageDescription && <br />}
      {messageDescription}
    </>
  );

  return (
    <div key="notification-component-wrapper" test-id={testId}>
      <Alert key="notification-component" type="error" showIcon={true} message={combinedMessage} />
    </div>
  );
};

export const Notification = observer(NotificationComponent);
