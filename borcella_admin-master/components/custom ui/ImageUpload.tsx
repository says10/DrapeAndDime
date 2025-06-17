"use client";

import { CldUploadWidget } from "next-cloudinary";
import { Plus, Trash, AlertCircle } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface ImageUploadProps {
  value: string[];
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
}

const ImageUpload = ({
  onChange,
  onRemove,
  value,
}: ImageUploadProps) => {
  const [widgetReady, setWidgetReady] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Check if Cloudinary is properly loaded
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).cloudinary) {
      setWidgetReady(true);
    } else {
      console.warn("Cloudinary not loaded properly for ImageUpload");
    }
  }, []);

  const onUpload = (result: any) => {
    console.log("Image upload result:", result);
    
    if (result.event === "success") {
      setUploadError(null);
      onChange(result.info.secure_url);
      toast.success("Image uploaded successfully!");
    } else if (result.event === "error") {
      setUploadError("Upload failed. Please try again.");
      toast.error("Image upload failed. Please try again.");
      console.error("Image upload error:", result);
    }
  };

  const onUploadError = (error: any) => {
    console.error("Image upload widget error:", error);
    setUploadError("Upload failed. Please check your connection and try again.");
    toast.error("Upload failed. Please check your connection and try again.");
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-4">
        {value.map((url) => (
          <div key={url} className="relative w-[200px] h-[200px]">
            <div className="absolute top-0 right-0 z-10">
              <Button type="button" onClick={() => onRemove(url)} size="sm" className="bg-red-1 text-white">
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <Image
              src={url}
              alt="collection"
              className="object-cover rounded-lg"
              fill
            />
          </div>
        ))}
      </div>

      {uploadError && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <span className="text-sm text-red-700">{uploadError}</span>
        </div>
      )}

      {!widgetReady && (
        <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <span className="text-sm text-yellow-700">Loading Cloudinary widget...</span>
        </div>
      )}

      <CldUploadWidget 
        uploadPreset="vwfnzfpo" 
        onUpload={onUpload}
        onError={onUploadError}
        options={{
          resourceType: "image",
          maxFileSize: 10000000, // 10MB
          sources: ["local", "camera"],
          multiple: false,
          cropping: false,
          showAdvancedOptions: false,
          showSkipCropButton: false,
          showUploadMoreButton: false,
          singleUploadAutoClose: true,
        }}
      >
        {({ open, isLoading }) => {
          return (
            <Button 
              type="button" 
              onClick={() => open()} 
              disabled={isLoading || !widgetReady}
              className="bg-grey-1 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-4 w-4 mr-2" />
              {isLoading ? "Loading..." : "Upload Image"}
            </Button>
          );
        }}
      </CldUploadWidget>

      {/* Debug Info (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-gray-500 p-2 bg-gray-50 rounded mt-2">
          <p>ImageUpload - Upload Preset: vwfnzfpo</p>
          <p>Widget Ready: {widgetReady ? "Yes" : "No"}</p>
          <p>Cloudinary Loaded: {typeof window !== 'undefined' && (window as any).cloudinary ? "Yes" : "No"}</p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
