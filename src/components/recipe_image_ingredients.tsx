import React, { useState, useEffect } from "react";

import TextContent from "@cloudscape-design/components/text-content";
import Alert from "@cloudscape-design/components/alert";
import { Badge, Container, TokenGroup } from "@cloudscape-design/components";
import Header from "@cloudscape-design/components/header";
import { SpaceBetween } from "@cloudscape-design/components";
import "../assets/css/style.css";

interface BotResponse {
  bot: string;
}

interface ImageData {
  image_0: string[];
}

const extractImageList = (response: BotResponse): string[] => {
  try {
    if (!response || !response.bot) {
      return [];
    }

    // Get the bot response string
    const botResponse = response.bot;

    // Find the JSON part within the string
    const startIdx = botResponse.indexOf("{");
    const endIdx = botResponse.lastIndexOf("}") + 1;

    if (startIdx !== -1 && endIdx !== -1) {
      // Extract and parse the JSON part
      const jsonStr = botResponse.slice(startIdx, endIdx);
      const jsonData = JSON.parse(jsonStr) as ImageData;

      // Get the image list
      return jsonData.image_0 || [];
    }

    return [];
  } catch (error) {
    console.error("Error extracting image list:", error);
    return [];
  }
};
interface BotResponse {
  bot: string;
}

const RecipeImageIngredients: React.FC<any> = ({ payload, actionProvider }) => {
  const { generateRecipeImage, imageIngredientsResponse } = payload;
 
  // const [ingredients, setIngredients] = useState(
  //   extractImageList(imageIngredientsResponse) || []
  // );

  return (
    <TextContent>
      {/* {ingredients && ingredients.length > 0 && (
        <div>
          <SpaceBetween direction="vertical" size="m">
            <Container
              footer={
                <TokenGroup
                  items={ingredients.map((item, index) => ({
                    label: item,
                    dismissLabel: `Remove ${item}`,
                  }))}
                  onDismiss={({ detail: { itemIndex } }) => {
                    setIngredients([
                      ...ingredients.slice(0, itemIndex),
                      ...ingredients.slice(itemIndex + 1),
                    ]);
                  }}
                />
              }
              header={
                <div>
                  <Header variant="h2">
                    Here are the ingredients detected in the image using AI
                  </Header>
                  <div>
                    <img
                      width={300}
                      height={300}
                      src={`data:image/png;base64, ${generateRecipeImage}`}
                    ></img>
                  </div>
                </div>
              }
            ></Container>
          </SpaceBetween>
        </div>
      )} */}
      <div>
        
        <div style={{ "margin":"0 0px 0px 50px"}}>
          <img style={{ "margin":"0 0px 0px 50px"}}
            width={250}
            height={250}
            src={`data:image/png;base64, ${generateRecipeImage}`}
          ></img>
        </div>
      </div>

      {generateRecipeImage === null && (
        <div>
          <Alert
            i18nStrings={{ successIconAriaLabel: "Success" }}
            type="success"
          >
            No ingredients detected in the image. Please try again.
          </Alert>
        </div>
      )}
    </TextContent>
  );
};

export default RecipeImageIngredients;
