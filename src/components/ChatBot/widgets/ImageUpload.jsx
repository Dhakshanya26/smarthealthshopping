import React from "react";
import { FileUpload } from "@cloudscape-design/components";
import Button from "@cloudscape-design/components/button";

const ImageUpload = ({ actionProvider }) => {
  function resizeImage(image, width, height) {
    const canvas = document.createElement("canvas");
    const ratio = image.height / image.width;
    canvas.width = width;
    canvas.height = height * ratio;
 
    const ctx = canvas.getContext("2d");

    if (ctx) {
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL();
    }
  }

  const fileUploadOnChange = ({ detail }) => {
    const files = detail.value;
    if (files.length > 0) {
      const reader = new FileReader();

      reader.onload = () => {
        const image = new Image();
        image.src = reader.result;

        image.onload = () => {
          const resizedImage = resizeImage(image, 400, 400);
          actionProvider.handleImageUpload(resizedImage);
        };
      };
      reader.readAsDataURL(files[0]);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "16px",
      }}
    >
      <FileUpload
        onChange={fileUploadOnChange}
        value={[]}
        accept="image/png, image/jpg"
        i18nStrings={{
          uploadButtonText: (e) => (e ? "Take Fridge Photo" : "Upload"),
          dropzoneText: (e) =>
            e ? "Drop files to upload" : "Drop file to upload",
          removeFileAriaLabel: (e) => `Remove file ${e + 1}`,
          limitShowFewer: "Show fewer files",
          limitShowMore: "Show more files",
          errorIconAriaLabel: "Error",
        }}
        aria-hidden={false}
        tokenLimit={1}
      />

      <Button onClick={actionProvider.startCam}>Capture</Button>
      <Button onClick={actionProvider.cancelUpload}>Cancel</Button>
    </div>
  );
};

export default ImageUpload;
