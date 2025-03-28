import React, { useCallback, useRef, useState } from "react";
import {
  SpaceBetween,
  Box,
  SegmentedControl,
  FileUpload,
} from "@cloudscape-design/components";
import Button from "@cloudscape-design/components/button";
import Webcam from "react-webcam";
import ImageIngredients from "./recipe_image_ingredients";

const Recipe: React.FC<{ actionProvider: any }> = () => {
  const webcamRef = useRef<any>();
  const [imgSrc, setImgSrc] = useState<string | null>(null);
 
  const [selectedImgSrc] = useState<string | null>(null);
  const [showWebcam, setShowWebcam] = useState(false);
  const [showOptionsButtons, setShowOptionsButtons] = useState(true);
  const [loadingVideoDevices, setLoadingVideoDevices] = useState(false);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<{
    value: string;
  } | null>(null);
 
  function resizeBase64Image(
    base64Image: string,
    width: number,
    height: number
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      // Create an Image element
      const image = new Image();
      image.src = base64Image;

      // Handle image load
      image.onload = () => {
        try {
          const resizedDataUrl = resizeImage(image, width, height);
          resolve(resizedDataUrl as string);
        } catch (error) {
          reject(error);
        }
      };

      // Handle image load error
      image.onerror = () => {
        reject("Failed to load image");
      };
    });
  }
  function resizeImage(image: any, width: number, height: number) {
    // Create a canvas element

    const canvas = document.createElement("canvas");
    const ratio = image.height / image.width;
    // Set the canvas dimensions to the desired size
    canvas.width = width;
    canvas.height = height * ratio;
    
    // Get the 2D rendering context of the canvas
    const ctx = canvas.getContext("2d");

    if (ctx) {
      // Draw the image on the canvas, resizing it to the desired size

      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      return canvas.toDataURL();
    }
  }

  async function handleResize(imageSrc: string) {
    try {
      const resizedImage = await resizeBase64Image(imageSrc, 400, 400);
      setImgSrc(resizedImage ?? null);
    } catch (error) {
      console.error("Error resizing image:", error);
      setImgSrc(null);
    }
  }

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current!.getScreenshot();
      handleResize(imageSrc);
      setShowWebcam(false);
      setShowOptionsButtons(true);
    }
  }, [webcamRef]);

  const cancelWebcam = () => {
    setShowWebcam(false);
    setImgSrc(null);
  }; 

  return (
    <div>
      <SpaceBetween direction="vertical" size="m">
        <Box>
          <div className="container">
            <div style={{ textAlign: "center" }}>
              {/* Conditionally render the webcam or captured image */}
              {showWebcam && !imgSrc && (
                <div>
                  {loadingVideoDevices ? (
                    <div
                      style={{
                        textAlign: "center",
                        minHeight: "40vh",
                        border: "1px solid grey",
                        borderRadius: "4px",
                        padding: "10px",
                        background: "white",
                      }}
                    >
                      Searching for video devices in progress ...
                    </div>
                  ) : (
                    <div>
                      <SpaceBetween direction="vertical" size="m">
                        {devices.length > 1 && (
                          <div
                            style={{
                              justifyContent: "center",
                              display: "flex",
                            }}
                          >
                            <SegmentedControl
                              selectedId={selectedDevice?.value ?? null}
                              options={devices.map((device) => ({
                                text: device.label.replace(" Camera", ""),
                                id: device.deviceId,
                              }))}
                              onChange={({ detail }) => {
                                setSelectedDevice({
                                  value: detail.selectedId,
                                });
                              }}
                            />
                          </div>
                        )}

                        {selectedDevice && (
                          <SpaceBetween direction="vertical" size="m">
                            <div
                              style={{
                                textAlign: "center",
                                minHeight: "40vh",
                                border: "1px solid grey",
                                borderRadius: "4px",
                                padding: "10px",
                                background: "white",
                              }}
                            >
                              <Webcam
                                audio={false}
                                videoConstraints={{
                                  deviceId: selectedDevice.value,
                                }}
                                ref={webcamRef}
                                style={{
                                  borderRadius: "5px",
                                  display: "block",
                                  margin: "auto",
                                  // height: "40vh",
                                  maxWidth: "100%",
                                  objectFit: "contain",
                                }}
                              />
                              <div
                                style={{
                                  textAlign: "center",
                                  display: "flex",
                                  gap: "2rem",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  marginTop: "10px",
                                }}
                              >
                                <Button onClick={capture} variant="primary">
                                  Capture image
                                </Button>
                                <Button
                                  onClick={cancelWebcam}
                                  variant="primary"
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          </SpaceBetween>
                        )}
                      </SpaceBetween>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </Box>

        <div id="reader"></div>

        {selectedImgSrc && (
          <div>
            <ImageIngredients
              img={selectedImgSrc}
              onRecipePropositionsDone={() => {
                setShowWebcam(false);
              }}
            />
          </div>
        )}
      </SpaceBetween>
    </div>
  );
};

export default Recipe;
