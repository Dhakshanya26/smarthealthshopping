import {
  Button,
  SegmentedControl,
  SpaceBetween,
} from "@cloudscape-design/components";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";

const ImageCapture = memo(({ actionProvider, payload }) => {
  const [showWebcam, setShowWebcam] = useState(payload?.startWebcam || false);
  const [loadingVideoDevices, setLoadingVideoDevices] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const webcamRef = useRef();
  const imgSrc = useRef();
  const devices = useRef([]);

  useEffect(() => {
    if (showWebcam) {
      enumerateDevices();
    }
  }, []);

  const capture = async () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current?.getScreenshot();
      imgSrc.current = await handleResize(imageSrc);
      if (imgSrc.current) {
        setShowWebcam(false);
        actionProvider?.handleImageUpload(imgSrc.current, true);
      }
    }
  };

  const enumerateDevices = async () => {
    try {
      setLoadingVideoDevices(true);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true,
      });
      const mediaDevices = await navigator.mediaDevices.enumerateDevices();
      mediaStream.getTracks().forEach((track) => track.stop());
      const videoDevices = mediaDevices.filter(
        (device) => device.kind === "videoinput"
      );

      devices.current = videoDevices;
      const deviceId = videoDevices.filter((d) =>
        d.label.toLowerCase().includes("back")
      );
      if (deviceId.length > 0) {
        setSelectedDevice({
          value: deviceId[0].deviceId,
        });
      } else if (videoDevices.length > 0) {
        setSelectedDevice({
          value: videoDevices[0].deviceId,
        });
      }
    } catch (error) {
      console.error("Error enumerating devices:", error);
    } finally {
      setLoadingVideoDevices(false);
    }
  };

  async function handleResize(imageSrc) {
    try {
      const resizedImage = await resizeBase64Image(imageSrc, 400, 400);
      return resizedImage;
    } catch (error) {
      console.error("Error resizing image:", error);
      return null;
    }
  }

  function resizeBase64Image(base64Image, width, height) {
    return new Promise((resolve, reject) => {
      // Create an Image element
      const image = new Image();
      image.src = base64Image;

      // Handle image load
      image.onload = () => {
        try {
          const resizedDataUrl = resizeImage(image, width, height);
          resolve(resizedDataUrl);
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

  function resizeImage(image, width, height) {
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

  const cancelWebcam = () => {
    setShowWebcam(false);
    imgSrc.current = null;
    actionProvider?.cancelCapture();
  };

  return (
    <>
      {/* Conditionally render the webcam or captured image */}
      {showWebcam && (
        <div>
          {loadingVideoDevices ? (
            <div
              style={{
                textAlign: "center",
                minHeight: "30vh",
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
                {devices.current.length > 1 && (
                  <div
                    style={{
                      justifyContent: "center",
                      display: "flex",
                    }}
                  >
                    <SegmentedControl
                      selectedId={selectedDevice?.value ?? null}
                      options={devices.current.map((device, index) => ({
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
                        <Button onClick={cancelWebcam} variant="primary">
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
    </>
  );
});

export default ImageCapture;
