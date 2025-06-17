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
    <div className="space-y-4">
      {/* Media Type Selector */}
      <div className="flex gap-2">
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
        <div className="relative">
          {mediaType === 'image' ? (
            <div className="relative w-full rounded-lg overflow-hidden" style={{ aspectRatio }}>
              <Image
                src={value}
                alt="banner"
                className="object-cover"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
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
          ) : (
            <div className="relative w-full rounded-lg overflow-hidden" style={{ aspectRatio }}>
              <video
                src={value}
                className="w-full h-full object-cover"
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
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <span className="text-sm text-red-700">{uploadError}</span>
        </div>
      )}

      {/* Widget Loading */}
      {!widgetReady && (
        <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
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
              className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-8 w-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-600">
                Upload {mediaType === 'image' ? 'Image' : 'Video'} ({aspectRatio})
              </span>
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};

export default MediaUpload; 