"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import ImageUpload from "./custom ui/ImageUpload";
import VideoUpload from "./custom ui/VideoUpload";
import toast from "react-hot-toast";

interface CarouselItem {
  media: string;
  mediaType: "image" | "video";
  link: string;
}

export default function MobileRootCarouselForm() {
  const [items, setItems] = useState<CarouselItem[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAddItem = () => {
    setItems([
      ...items,
      { media: "", mediaType: "image", link: "" },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, field: keyof CarouselItem, value: string) => {
    setItems(items.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/mobile-root-carousel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      if (res.ok) {
        toast.success("Mobile root carousel updated!");
      } else {
        toast.error("Failed to update carousel");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="text-xs text-blue-600 mb-2">
        Note: This carousel is for the <b>mobile version of the store root page only</b>.
      </div>
      {items.map((item, idx) => (
        <div key={idx} className="border rounded-lg p-4 mb-4 bg-white shadow-sm relative">
          <button
            type="button"
            className="absolute top-2 right-2 text-red-600 text-xs"
            onClick={() => handleRemoveItem(idx)}
          >
            Remove
          </button>
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Media Type</label>
            <select
              value={item.mediaType}
              onChange={e => handleChange(idx, "mediaType", e.target.value)}
              className="border rounded px-2 py-1"
            >
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>
          </div>
          <div className="mb-2">
            {item.mediaType === "image" ? (
              <ImageUpload
                value={item.media ? [item.media] : []}
                onChange={url => handleChange(idx, "media", url)}
                onRemove={() => handleChange(idx, "media", "")}
              />
            ) : (
              <VideoUpload
                value={item.media}
                onChange={url => handleChange(idx, "media", url)}
                onRemove={() => handleChange(idx, "media", "")}
              />
            )}
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Link (View Collection)</label>
            <Input
              value={item.link}
              onChange={e => handleChange(idx, "link", e.target.value)}
              placeholder="e.g., /collections/123"
            />
          </div>
        </div>
      ))}
      <Button type="button" onClick={handleAddItem} className="bg-blue-600 text-white">
        Add Carousel Item
      </Button>
      <Button type="submit" className="bg-green-600 text-white" disabled={loading}>
        {loading ? "Saving..." : "Save Carousel"}
      </Button>
    </form>
  );
} 