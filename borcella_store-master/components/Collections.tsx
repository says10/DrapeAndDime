import { getCollections } from "@/lib/actions/actions";
import Image from "next/image";
import Link from "next/link";

const Collections = async () => {
  const collections = await getCollections();

  return (
    <div className="related-products-container flex flex-col items-center gap-10 py-8 px-5">
      <p className="text-heading1-bold">Collections</p>
      {!collections || collections.length === 0 ? (
        <p className="text-body-bold">No collections found</p>
      ) : (
        <div className="flex flex-wrap items-center justify-center gap-8">
          {collections.map((collection: CollectionType) => (
            <Link href={`/collections/${collection._id}`} key={collection._id}>
              <div className="relative w-[350px] h-[200px] rounded-lg overflow-hidden">
                <Image
                  src={collection.image}
                  alt={collection.title}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 350px) 100vw, 350px"
                  priority
                />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Collections;
