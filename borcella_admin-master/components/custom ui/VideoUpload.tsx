"use client";

import { CldUploadWidget } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { Trash, Upload, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface VideoUploadProps {
  value: string;
  onChange: (value: string) => void;
  onRemove: () => void;
  aspectRatio?: "16:9" | "9:16";
}

const VideoUpload: React.FC<VideoUploadProps> = ({
  value,
  onChange,
  onRemove,
  aspectRatio = "16:9"
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [widgetReady, setWidgetReady] = useState(false);

  // Check if Cloudinary is properly loaded
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).cloudinary) {
      setWidgetReady(true);
    } else {
      console.warn("Cloudinary not loaded properly");
    }
  }, []);

  const onUpload = (result: any) => {
    console.log("Upload result:", result);
    
    if (result.event === "success") {
      setIsUploading(false);
      setUploadError(null);
      onChange(result.info.secure_url);
      toast.success("Video uploaded successfully!");
    } else if (result.event === "error") {
      setIsUploading(false);
      setUploadError("Upload failed. Please try again.");
      toast.error("Video upload failed. Please try again.");
      console.error("Upload error:", result);
    } else if (result.event === "progress") {
      setIsUploading(true);
      console.log("Upload progress:", result);
    }
  };

  const onUploadError = (error: any) => {
    console.error("Upload widget error:", error);
    setIsUploading(false);
    setUploadError("Upload failed. Please check your connection and try again.");
    toast.error("Upload failed. Please check your connection and try again.");
  };

  const handleOpenUpload = () => {
    setUploadError(null);
    setIsUploading(false);
    
    // Add a timeout to detect if the widget is hanging
    setTimeout(() => {
      if (!widgetReady) {
        setUploadError("Cloudinary widget is not loading. Please refresh the page.");
        toast.error("Cloudinary widget is not loading. Please refresh the page.");
      }
    }, 5000);
  };

  return (
    <div className="space-y-4">
      {value && (
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

      {uploadError && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <span className="text-sm text-red-700">{uploadError}</span>
        </div>
      )}

      {!widgetReady && (
        <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <span className="text-sm text-yellow-700">Loading Cloudinary widget...</span>
        </div>
      )}

      <CldUploadWidget 
        uploadPreset="vwfnzfpo" 
        onUpload={onUpload}
        onError={onUploadError}
        options={{
          resourceType: "video",
          maxFileSize: 100000000, // 100MB
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
              onClick={() => {
                handleOpenUpload();
                open();
              }}
              disabled={isLoading || isUploading || !widgetReady}
              className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading || isUploading ? (
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-2"></div>
                  <span className="text-sm text-gray-600">
                    {isUploading ? "Uploading..." : "Loading..."}
                  </span>
                </div>
              ) : (
                <>
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">
                    Upload {aspectRatio} Video
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    Max 100MB, MP4, WebM, OGG, MOV, AVI
                  </span>
                </>
              )}
            </Button>
          );
        }}
      </CldUploadWidget>

      {/* Debug Info (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-gray-500 p-2 bg-gray-50 rounded">
          <p>Upload Preset: vwfnzfpo</p>
          <p>Aspect Ratio: {aspectRatio}</p>
          <p>Current Value: {value ? "Set" : "Not set"}</p>
          <p>Widget Ready: {widgetReady ? "Yes" : "No"}</p>
          <p>Cloudinary Loaded: {typeof window !== 'undefined' && (window as any).cloudinary ? "Yes" : "No"}</p>
        </div>
      )}
    </div>
  );
};

export default VideoUpload; 