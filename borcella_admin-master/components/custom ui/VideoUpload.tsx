"use client";

import { CldUploadWidget } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { Trash, Upload } from "lucide-react";

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
  const onUpload = (result: any) => {
    onChange(result.info.secure_url);
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

      <CldUploadWidget 
        uploadPreset="vwfnzfpo" 
        onUpload={onUpload}
        options={{
          resourceType: "video",
          maxFileSize: 100000000, // 100MB
        }}
      >
        {({ open }) => {
          return (
            <Button
              type="button"
              onClick={() => open()}
              className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-gray-400 transition-colors"
            >
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-600">
                Upload {aspectRatio} Video
              </span>
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};

export default VideoUpload; 