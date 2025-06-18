"use client";

import { getCollections } from "@/lib/actions/actions";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const isVideo = (url: string) => /\.(mp4|webm|ogg)$/i.test(url);

const Collections = () => {
  const [collections, setCollections] = useState<CollectionType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const collectionsData = await getCollections();
        setCollections(collectionsData);
      } catch (error) {
        console.error("Error fetching collections:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  if (loading) {
    return (
      <div className="related-products-container flex flex-col items-center gap-10 py-8 px-5">
        <p className="text-heading1-bold">Collections</p>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="related-products-container flex flex-col items-center gap-10 py-8 px-5">
      <p className="text-heading1-bold">Collections</p>
      {!collections || collections.length === 0 ? (
        <p className="text-body-bold">No collections found</p>
      ) : (
        <div className="flex flex-col w-full gap-8">
          {collections.map((collection: CollectionType) => (
            <Link href={`/collections/${collection._id}`} key={collection._id} className="w-full">
              <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100">
                {isVideo(collection.image) ? (
                  <video
                    src={collection.image}
                    className="object-cover w-full h-full"
                    style={{ aspectRatio: '16/9' }}
                    muted
                    playsInline
                  />
                ) : (
                  <Image
                    src={collection.image}
                    alt={collection.title}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                    sizes="100vw"
                    priority
                    style={{ aspectRatio: '16/9' }}
                  />
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Collections;
