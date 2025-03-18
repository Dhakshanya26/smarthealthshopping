import { memo } from "react";

const ErrorMessage = memo(({ payload }) => {
  const { isError, errorMessage } = payload;

  return isError ? (
    <>
      <div className="react-chatbot-kit-chat-bot-message-container">
        <div className="react-chatbot-kit-chat-bot-error-message">
          <span>{errorMessage}</span>
        </div>
      </div>
    </>
  ) : null;
});

export default ErrorMessage;
