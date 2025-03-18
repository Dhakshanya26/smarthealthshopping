import { SpaceBetween } from "@cloudscape-design/components";
import React from "react";
import Button from "@cloudscape-design/components/button";

const ImagePreview = ({ payload, actionProvider }) => {
  if (payload === undefined) {
    return null;
  }

  if (payload.imageSrc === null) {
    return <span>no Image found!</span>;
  }
  return (
    <>
      <div style={{ textAlign: "center", maxHeight: "70vh" }}>
        <img
          src={payload.imageSrc}
          style={{
            borderRadius: "5px",
            display: "block",
            margin: "auto",
            height: "25vh",
            maxWidth: "100%",
            objectFit: "contain",
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "10px",
        }}
      >
        <SpaceBetween direction="horizontal" size="s">
          <Button
            onClick={
              payload.isCam ? actionProvider.recapture : actionProvider.retake
            }
            variant="primary"
          >
            Retake
          </Button>
          <Button
            onClick={() => actionProvider.useThisImage(payload.imageSrc)}
            variant="primary"
          >
            Yes
          </Button>
        </SpaceBetween>
      </div>
    </>
  );
};

export default ImagePreview;
