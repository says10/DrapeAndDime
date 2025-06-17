"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Trash, Upload, Image as ImageIcon, Video } from "lucide-react";
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
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    
    if (mediaType === 'image' && !isImage) {
      toast.error("Please select an image file");
      return;
    }
    
    if (mediaType === 'video' && !isVideo) {
      toast.error("Please select a video file");
      return;
    }

    // Validate file size (100MB for videos, 10MB for images)
    const maxSize = mediaType === 'video' ? 100 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error(`File size must be less than ${mediaType === 'video' ? '100MB' : '10MB'}`);
      return;
    }

    setIsUploading(true);
    
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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* Media Type Toggle */}
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
            <img
              src={value}
              alt="Preview"
              className="w-full rounded-lg"
              style={{ aspectRatio }}
            />
          ) : (
            <video
              src={value}
              className="w-full rounded-lg"
              style={{ aspectRatio }}
              controls
              muted
            />
          )}
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

      {/* Upload Area */}
      <div
        className={`w-full h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-colors cursor-pointer ${
          isDragOver 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={mediaType === 'image' ? 'image/*' : 'video/*'}
          onChange={handleFileSelect}
          className="hidden"
        />
        
        {isUploading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-2"></div>
            <span className="text-sm text-gray-600">Uploading...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Upload className="h-8 w-8 text-gray-400 mb-2" />
            <span className="text-sm text-gray-600">
              {isDragOver 
                ? `Drop ${mediaType} here` 
                : `Click to upload ${mediaType} or drag and drop`
              }
            </span>
            <span className="text-xs text-gray-500 mt-1">
              {aspectRatio} {mediaType} • Max {mediaType === 'video' ? '100MB' : '10MB'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaUpload; 