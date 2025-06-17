"use client";

import { CldUploadWidget } from "next-cloudinary";
import { Plus, Trash, AlertCircle, Image as ImageIcon, Video } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface MediaUploadProps {
  value: string;
  mediaType: 'image' | 'video';
  onChange: (value: string) => void;
  onRemove: () => void;
  onTypeChange: (type: 'image' | 'video') => void;
  aspectRatio?: "16:9" | "9:16";
}

const MediaUpload = ({
  value,
  mediaType,
  onChange,
  onRemove,
  onTypeChange,
  aspectRatio = "16:9"
}: MediaUploadProps) => {
  const [widgetReady, setWidgetReady] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Check if Cloudinary is properly loaded
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).cloudinary) {
      setWidgetReady(true);
    } else {
      console.warn("Cloudinary not loaded properly for MediaUpload");
    }
  }, []);

  const onUpload = (result: any) => {
    console.log("Media upload result:", result);
    
    if (result.event === "success") {
      setUploadError(null);
      onChange(result.info.secure_url);
      toast.success(`${mediaType === 'image' ? 'Image' : 'Video'} uploaded successfully!`);
    } else if (result.event === "error") {
      setUploadError("Upload failed. Please try again.");
      toast.error(`${mediaType === 'image' ? 'Image' : 'Video'} upload failed. Please try again.`);
      console.error("Media upload error:", result);
    }
  };

  const onUploadError = (error: any) => {
    console.error("Media upload widget error:", error);
    setUploadError("Upload failed. Please check your connection and try again.");
    toast.error("Upload failed. Please check your connection and try again.");
  };

  return (
    <div>
      {/* Media Type Selector */}
      <div className="flex gap-2 mb-4">
        <Button
          type="button"
          variant={mediaType === 'image' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onTypeChange('image')}
          className="flex items-center gap-2"
        >
          <ImageIcon className="h-4 w-4" />
          Image
        </Button>
        <Button
          type="button"
          variant={mediaType === 'video' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onTypeChange('video')}
          className="flex items-center gap-2"
        >
          <Video className="h-4 w-4" />
          Video
        </Button>
      </div>

      {/* Preview */}
      {value && (
        <div className="mb-4">
          {mediaType === 'image' ? (
            <div className="relative w-[200px] h-[200px]">
              <div className="absolute top-0 right-0 z-10">
                <Button type="button" onClick={onRemove} size="sm" className="bg-red-1 text-white">
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
              <Image
                src={value}
                alt="banner"
                className="object-cover rounded-lg"
                fill
              />
            </div>
          ) : (
            <div className="relative">
              <video
                src={value}
                className="w-full rounded-lg"
                style={{ aspectRatio }}
                controls
                muted
              />
              <Button
                type="button"
                onClick={onRemove}
                size="sm"
                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Upload Error */}
      {uploadError && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <span className="text-sm text-red-700">{uploadError}</span>
        </div>
      )}

      {/* Widget Loading */}
      {!widgetReady && (
        <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <span className="text-sm text-yellow-700">Loading Cloudinary widget...</span>
        </div>
      )}

      {/* Upload Widget */}
      <CldUploadWidget 
        uploadPreset="vwfnzfpo" 
        onUpload={onUpload}
        onError={onUploadError}
        options={{
          resourceType: mediaType,
          maxFileSize: mediaType === 'image' ? 10000000 : 100000000, // 10MB for images, 100MB for videos
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
              {isLoading ? "Loading..." : `Upload ${mediaType === 'image' ? 'Image' : 'Video'} (${aspectRatio})`}
            </Button>
          );
        }}
      </CldUploadWidget>

      {/* Debug Info (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-gray-500 p-2 bg-gray-50 rounded mt-2">
          <p>MediaUpload - Upload Preset: vwfnzfpo</p>
          <p>Media Type: {mediaType}</p>
          <p>Widget Ready: {widgetReady ? "Yes" : "No"}</p>
          <p>Cloudinary Loaded: {typeof window !== 'undefined' && (window as any).cloudinary ? "Yes" : "No"}</p>
        </div>
      )}
    </div>
  );
};

export default MediaUpload; 