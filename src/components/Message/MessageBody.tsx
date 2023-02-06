import { useEffect, useRef } from "react";
import {
  closeIconHoverStyle,
  closeIconStyle,
  messageBodyStyle,
  notificationsWrapperStyle,
} from "./Message.styles";
import type { IMessageBodyProps } from "./Messsage.types";
import { message } from "antd";
import { useTheme } from "../../decorators/hooks/useTheme";
import { CloseOutlined } from "../Icons/Icons";

const MessageBody: React.FC<IMessageBodyProps> = (props) => {
  const { messageBody } = props;

  const closeMessageTimer = useRef<NodeJS.Timeout | undefined>();
  const theme = useTheme();

  const setTimer = () => {
    closeMessageTimer.current = setTimeout(
      () => message.destroy(props.messageKey),
      props.duration
    );
  };

  const stopTimer = () =>
    closeMessageTimer.current && clearTimeout(closeMessageTimer.current);

  const destroyMessage = () => message.destroy(props.messageKey);

  useEffect(setTimer, []);

  return (
    <div
      css={messageBodyStyle}
      onMouseEnter={stopTimer}
      onMouseLeave={setTimer}
    >
      <div css={notificationsWrapperStyle}>{messageBody}</div>
      <CloseOutlined
        css={closeIconHoverStyle}
        style={closeIconStyle(theme)}
        onClick={destroyMessage}
      />
    </div>
  );
};

export default MessageBody;
