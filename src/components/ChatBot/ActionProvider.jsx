import React from "react";
import { useDataProvider } from "../../common/DataProvider";
import Loader from "./Loader";
import { createClientMessage, createCustomMessage } from "react-chatbot-kit";
import { useGlobalState } from "../../common/GlobalState";

function isJSON(text) {
  if (typeof text !== "string") {
    return false;
  }
  try {
    JSON.parse(text);
    return true;
  } catch (error) {
    return false;
  }
}

const ActionProvider = ({ createChatBotMessage, setState, children }) => {
  const { postAPI, getAPI } = useDataProvider();
  const { setCurrentCartId } = useGlobalState();
  //show hello message
  const handleHello = () => {
    const botMessage = createChatBotMessage(
      "Hello. Nice to meet you. I am here to help you with personalized nutritional shopping and cooking recipes"
    );

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };

  //handle bot API message
  const handleBotApi = async (usrMsg) => {
    // Loading before API call
    const loading = createChatBotMessage(<Loader />);

    setState((prev) => ({ ...prev, messages: [...prev.messages, loading] }));

    if (usrMsg === "upload") {
      handleUpload();
      return;
    }

    try {
      const botRes = await postAPI("/message", usrMsg);
      console.log("BOT RESPONSE: ", botRes);
    
      if (botRes && botRes.bot) {
        const botResponseParsed = isJSON(botRes.bot)
          ? JSON.parse(botRes.bot)
          : botRes.bot;

        if (
          botResponseParsed &&
          botResponseParsed.agent == "Order Manager" &&
          botResponseParsed["Cart Id"]
        ) {
          setCurrentCartId(botResponseParsed["Cart Id"]);
        }

        const botMessage = createChatBotMessage(
          botResponseParsed?.message || botResponseParsed
        );

        setState((prev) => {
          // Remove Loading
          const newPrevMsg = prev.messages.slice(0, -1);
          return { ...prev, messages: [...newPrevMsg, botMessage] };
        });
        
        generateImage (botResponseParsed);

        if (botRes.error != undefined) {
          setState((prev) => {
            const newPrevMsg = prev.messages.slice(0, -1);
            return { ...prev, messages: [...newPrevMsg, botRes.error] };
          });
        }
      }
    } catch (error) {
      handleErrorMessage(error?.message);
    }
  };

  const generateImage = async (botResponseParsed) => 
  {
    if (
      botResponseParsed.tag &&
      botResponseParsed.tag == "image" &&
      botResponseParsed?.message
    ) {
      const loading = createChatBotMessage(<Loader message={"Generating Image"}/>);
      setState((prev) => ({ ...prev, messages: [...prev.messages, loading] }));

      const generateRecipeImageResponse = await postAPI(
        `/imagegenerator`,
        botResponseParsed?.message,
        "image"
      );
      
      const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

      sleep(5000);
     const generateRecipeImage = generateRecipeImageResponse?.base64Image; 
     const botMessageForImage = createChatBotMessage("Generated Image ...", {
        widget: "recipeIngredients",
        payload: { generateRecipeImage, imageIngredientsResponse: null },
      });

      setState((prev) => {
        const newPrevMsg = prev.messages.slice(0, -1);
        return { ...prev, messages: [...newPrevMsg, botMessageForImage] };
      });

    } 
  }
  //handle show generic bot message
  const handleShowBotMessage = (msg) => {
    const botMessage = createChatBotMessage(msg);
    setState((prev) => ({ ...prev, messages: [...prev.messages, botMessage] }));
  };

  //handle selected or uploaded Image via API
  const useThisImage = async (imgSrc) => {
    const loading = createChatBotMessage(
      <Loader message="Finding Recipe for the ingredients in image..." />
    );

    setState((prev) => ({ ...prev, messages: [...prev.messages, loading] }));

    const botRes = await postAPI("/message", imgSrc, "image");
    console.log("BOT RES: ", botRes);
    if (botRes && "bot" in botRes) {
         debugger;
         const botResponseParsed = isJSON(botRes.bot)
         ? JSON.parse(botRes.bot)
         : botRes.bot;

      const botMessage = createChatBotMessage(
        botResponseParsed?.message || botResponseParsed
      );

      setState((prev) => {
        // Remove Loading
        const newPrevMsg = prev.messages.slice(0, -1);
        return { ...prev, messages: [...newPrevMsg, botMessage] };
      });

      generateImage(botResponseParsed);
    }
  };
 
   
  //Upload an image
  const handleUpload = () => {
    const botMessage = createChatBotMessage(
      "Click on 'Take Fridge Photo and take a photo of your ingredients",
      {
        widget: "imageUpload",
      }
    );
    setState((prev) => {
      // Remove Loading
      const newPrevMsg = prev.messages.slice(0, -1);
      return { ...prev, messages: [...newPrevMsg, botMessage] };
    });
  };

  //retake picture or upload new image
  const retake = () => {
    handleUpload();
  };

  //show Uploaded /captured Image Preview
  const handleImageUpload = (imageUrl, isCam = false) => {
    const message = createChatBotMessage(
      "Are you sure you want to use the image?",
      {
        widget: "imagePreview",
        payload: { imageSrc: imageUrl, isCam: isCam },
      }
    );
    setState((prev) => ({ ...prev, messages: [...prev.messages, message] }));
  };

  //handle cancel upload
  const cancelUpload = () => {
    const message = createChatBotMessage("What else can I do for you?");
    setState((prev) => ({ ...prev, messages: [...prev.messages, message] }));
  };

  //handle Cancel webcam Capture
  const cancelCapture = () => {
    const message = createChatBotMessage("What else can I do for you?");
    setState((prev) => ({ ...prev, messages: [...prev.messages, message] }));
  };

  const recapture = () => {
    startCam();
  };

  //show custom Error message
  const handleErrorMessage = (errorMsg) => {
    const message = createCustomMessage("Error Occurred!", "error", {
      widget: "errorMessage",
      loading: true,
      payload: {
        isError: true,
        errorMessage: errorMsg
          ? errorMsg
          : "Something went wrong. please try again!",
      },
    });

    setState((prev) => {
      const newPrevMsg = prev.messages.slice(0, -1);
      return { ...prev, messages: [...newPrevMsg, message] };
    });
  };

  const startCam = () => {
    const message = createChatBotMessage("Capture an image", {
      widget: "imageCapture",
      payload: { startWebcam: true },
    });
    setState((prev) => {
      const newPrevMsg = prev.messages.slice(0, -1);
      return { ...prev, messages: [...newPrevMsg, message] };
    });
  };

  // const handleRecipeProposal = (ingredients = ["bread, butter"]) => {
  //   const message = createChatBotMessage("proposing recipe..", {
  //     widget: "recipeProposal",
  //     payload: { ingredients },
  //   });
  //   setState((prev) => ({ ...prev, messages: [...prev.messages, message] }));
  // };

  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          actions: {
            handleHello,
            handleBotApi,
            handleShowBotMessage,
            handleErrorMessage,
            handleUpload,
            handleImageUpload,
            cancelUpload,
            cancelCapture,
            recapture,
            useThisImage,
            retake,
            startCam
          },
        });
      })}
    </div>
  );
};

export default ActionProvider;
