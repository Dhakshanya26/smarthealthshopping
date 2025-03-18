import { createChatBotMessage } from "react-chatbot-kit";
import Recipe from "../recipe";
import ImagePreview from "./widgets/ImagePreview";
import ErrorMessage from "./widgets/ErrorMessage";
import ImageUpload from "./widgets/ImageUpload";
import ImageCapture from "./widgets/ImageCapture";
import RecipeImageIngredients from "../recipe_image_ingredients";
 

const botName = "Smart Shopping Assistant";

const config = {
  initialMessages: [createChatBotMessage(`Hi! I'm ${botName}`)],
  botName: botName,
  customMessages: {
    error: (props) => <ErrorMessage {...props} />,
  },
  widgets: [
    {
      widgetName: "imageUpload",
      widgetFunc: (props) => <ImageUpload {...props} />,
    },
    {
      widgetName: "imageView",
      widgetFunc: (props) => <Recipe {...props} />,
    },
    {
      widgetName: "imagePreview",
      widgetFunc: (props) => <ImagePreview {...props} />,
    },
    {
      widgetName: "imageCapture",
      widgetFunc: (props) => <ImageCapture {...props} />,
    },
    {
      widgetName: "recipeIngredients",
      widgetFunc: (props) => <RecipeImageIngredients {...props} />,
    } 
  ],
  customStyles: {
  
  },
};

export default config;
