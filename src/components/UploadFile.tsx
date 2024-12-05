"use client";
import React, { useRef, useState } from "react";
import { S3 } from "aws-sdk";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface UploadImageProps {
  onUploadSuccess: (imageUrl: string) => void;
  buttonStyle?: string; 
  buttonLabel?: string | React.ReactNode; 
  path?: string;
}

const UploadImage: React.FC<UploadImageProps> = ({
  onUploadSuccess,
  buttonStyle = "bg-blue-500 text-white py-2 px-4 rounded",
  buttonLabel = "Upload Image",
  path = ""
}) => {
  const ACCESSKEY = "il4raamk1tod3es3";
  const SECRETKEY = "4601b92b-16f0-42c8-8b09-d597ba417c2c";
  const ENDPOINT = "https://storage.iran.liara.space";
  const BUCKET = "ui-vision";

  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); 
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;

    if (!file) {
      setError("No file selected");
      return;
    }

    setUploading(true);
    setError(null);

    const s3 = new S3({
      accessKeyId: ACCESSKEY,
      secretAccessKey: SECRETKEY,
      endpoint: ENDPOINT,
      s3ForcePathStyle: true,
    });

    const params = {
      Bucket: BUCKET,
      Key: `${path}/${file.name}`, 
      Body: file,
      ACL: "public-read",
    };

    try {
      const data = await s3.upload(params).promise();
      const imageUrl = data.Location;

      await fetch("/api/user/updateProfile", {
        method: "POST",
        body: JSON.stringify({ imageUrl }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      onUploadSuccess(imageUrl);
      alert("Profile image updated successfully");
    } catch (error: any) {
      setError("Error uploading file: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <button
        className={buttonStyle}
        onClick={handleButtonClick}
        disabled={uploading}
      >
        {uploading ? <AiOutlineLoading3Quarters size={15} className=" animate-spin" /> : buttonLabel}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default UploadImage;