"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash, AlertCircle, Image as ImageIcon, Video } from "lucide-react";
import { toast } from "sonner";

interface MediaUploadProps {
  value: string;
  onChange: (value: string) => void;
  onRemove: () => void;
  mediaType: 'image' | 'video';
  onTypeChange: (type: 'image' | 'video') => void;
  aspectRatio?: "16:9" | "9:16";
}

const MediaUpload = ({
  value,
  onChange,
  onRemove,
  mediaType,
  onTypeChange,
  aspectRatio = "16:9"
}: MediaUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    
    if (mediaType === 'image' && !isImage) {
      setUploadError("Please select an image file");
      toast.error("Please select an image file");
      return;
    }
    
    if (mediaType === 'video' && !isVideo) {
      setUploadError("Please select a video file");
      toast.error("Please select a video file");
      return;
    }

    // Validate file size (100MB for videos, 10MB for images)
    const maxSize = mediaType === 'video' ? 100 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setUploadError(`File size must be less than ${mediaType === 'video' ? '100MB' : '10MB'}`);
      toast.error(`File size must be less than ${mediaType === 'video' ? '100MB' : '10MB'}`);
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    
    try {
      // Create FormData
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'vwfnzfpo');
      formData.append('resource_type', mediaType);

      // Upload to Cloudinary
      const response = await fetch(`https://api.cloudinary.com/v1_1/drapeanddime/${mediaType}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      onChange(result.secure_url);
      toast.success(`${mediaType === 'image' ? 'Image' : 'Video'} uploaded successfully!`);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(`Failed to upload ${mediaType}. Please try again.`);
      toast.error(`Failed to upload ${mediaType}. Please try again.`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      {/* Media Type Toggle */}
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
          <div className="relative w-[200px] h-[200px]">
            <div className="absolute top-0 right-0 z-10">
              <Button type="button" onClick={onRemove} size="sm" className="bg-red-1 text-white">
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            {mediaType === 'image' ? (
              <img
                src={value}
                alt="banner"
                className="object-cover rounded-lg w-full h-full"
              />
            ) : (
              <video
                src={value}
                className="object-cover rounded-lg w-full h-full"
                controls
                muted
              />
            )}
          </div>
        </div>
      )}

      {/* Upload Error */}
      {uploadError && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <span className="text-sm text-red-700">{uploadError}</span>
        </div>
      )}

      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={mediaType === 'image' ? 'image/*' : 'video/*'}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Upload Button */}
      <Button 
        type="button" 
        onClick={handleClick}
        disabled={isUploading}
        className="bg-grey-1 text-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Plus className="h-4 w-4 mr-2" />
        {isUploading ? "Uploading..." : `Upload ${mediaType === 'image' ? 'Image' : 'Video'} (${aspectRatio})`}
      </Button>

      {/* Debug Info (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-gray-500 p-2 bg-gray-50 rounded mt-2">
          <p>MediaUpload - Upload Preset: vwfnzfpo</p>
          <p>Media Type: {mediaType}</p>
          <p>Aspect Ratio: {aspectRatio}</p>
        </div>
      )}
    </div>
  );
};

export default MediaUpload; 