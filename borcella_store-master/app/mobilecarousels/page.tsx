"use client";
import { useEffect, useState } from "react";

type CarouselItem = {
  media: string;
  mediaType: "image" | "video";
  link: string;
};

export default function MobileCarouselsPage() {
  const [items, setItems] = useState<CarouselItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchItems() {
      setLoading(true);
      try {
        const res = await fetch("/api/mobile-root-carousel");
        if (res.ok) {
          const data = await res.json();
          setItems(data.items || []);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchItems();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Mobile Root Carousel Items</h1>
      {items.length === 0 ? (
        <div>No items found.</div>
      ) : (
        <div className="flex flex-col gap-6">
          {items.map((item, idx) => (
            <div key={idx} className="border rounded-lg p-4 bg-white shadow">
              <div className="mb-2">Type: {item.mediaType}</div>
              {item.mediaType === "video" ? (
                <video src={item.media} controls className="w-full max-w-xs" />
              ) : (
                <img src={item.media} alt="carousel" className="w-full max-w-xs rounded" />
              )}
              <div className="mt-2">Link: <a href={item.link} className="text-blue-600 underline">{item.link}</a></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 