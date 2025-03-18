import React, { useRef } from "react";

const MessageParser = ({ children, actions }) => {
  const parse = (msg) => {
    const message = msg.toLowerCase();
 

    actions.handleBotApi(msg);
  };

  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          parse: parse,
          actions: actions,
        });
      })}
    </div>
  );
};

export default MessageParser;
