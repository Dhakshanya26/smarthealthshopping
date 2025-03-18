import Chatbot from "react-chatbot-kit";
import { useEffect, useRef, useState } from "react";
// import 'react-chatbot-kit/build/main.css'
import { Button } from "@aws-amplify/ui-react";
import {
  BsFillChatFill,
  BsFillImageFill,
  BsImage,
  BsImageAlt,
  BsUpload,
} from "react-icons/bs";
import "./css_overrides.css";
import config from "./config";
import MessageParser from "./MessageParser";
import ActionProvider from "./ActionProvider";
import { v4 as uuid } from "uuid";
import Recipe from "../recipe";

const createSession = () => {
  const newUuid = uuid();
  localStorage.setItem("sessionid", newUuid);
 
};

const ChatBotComponent = () => {
  // state variable to track modal visibility
  const [visible, setVisible] = useState(false); 
  useEffect(() => {
    createSession();
  
  }, []);

 
  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
      }}
    >
      {visible ? (
        <div style={{ position: "relative" }}>
          <Chatbot
            config={config}
            messageParser={MessageParser}
            actionProvider={ActionProvider}
            headerText="Chatbot Assistant" //Override Config file
            placeholderText="message or type 'upload'"
          />
          <button
            style={{ position: "absolute", top: "-15px", right: "-8px" }}
            onClick={() => setVisible(false)}
          >
            X
          </button> 
        </div>
      ) : (
        <Button
          variation="primary"
          size="large"
          onClick={() => setVisible(true)}
        >
          <BsFillChatFill size={35} color="white" />{" "}
        </Button>
      )}
    </div>
  );
};

export default ChatBotComponent;

// user msg -> MsgParser -> Action
