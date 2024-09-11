"use client";
import React from "react";
import axios from "axios";
import { useState } from "react";

export default function UploadedImage({ id }: any) {
  const [file, setFile]: any = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedImage, setUploadedImage]: any = useState(null);

  const handleFileChange = (event: any) => {
    setFile(event.target.files[0]);
  };

  const handleUploadImage = async () => {
    setUploading(true);
    const formData = new FormData();
    formData.append("files", file);

    try {
      const STRAPIURL = process.env.NEXT_PUBLIC_STRAPI_URL_API;
      const response = await axios.post(`${STRAPIURL}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const fileId = response.data[0].id;
      //   console.log(fileId);
      setUploadedImage(response.data[0]);
      setUploading(false);
      // Update the user avatar field with the uploaded file ID
      const updateUserAvatar = async () => {
        try {
          const STRAPIURL = process.env.NEXT_PUBLIC_STRAPI_URL_API;
          const response = await axios.put(
            `${STRAPIURL}/users/${id}?populate=*`,
            {
              photo: fileId,
            }
          );

          //   console.log(response.data);
        } catch (error) {
          console.error(error);
        }
      };

      updateUserAvatar();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center space-y-5">
      {!uploadedImage && (
        <div className="flex flex-col items-center space-y-3">
          <input type="file" onChange={handleFileChange} />
          <button
            onClick={handleUploadImage}
            className="m-5 align-middle text-center select-none border font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline bg-red-600 text-white hover:bg-red-500 waves-effect waves-light"
          >
            تحديث
          </button>
        </div>
      )}

      {uploading ? (
        <div className="">
          <p className="text-center">جاري الرفع ...</p>
          <div
            className="animate-spin inline-block size-6 border-[3px] border-current border-t-transparent text-red-600 rounded-full"
            role="status"
            aria-label="loading"
          >
          </div>
        </div>
      ) : (
        uploadedImage && (
          <div className="flex flex-col items-center space-y-3">
            <img
              src={uploadedImage.url}
              alt={uploadedImage.name}
              className="rounded-full border-4 border-gray-300 shadow-md"
              width={150}
              height={150}
            />
            <p>تم تحديث الصورة بنجاح</p>
          </div>
        )
      )}
    </div>
  );
}
