// app/home/page.tsx

import Image from "next/image";
import Collections from "@/components/Collections";
import ProductList from "@/components/ProductList";

export default function Home() {
  return (
    <>
      {/* Original Homepage Content */}
      <div className="banner-container">
        <Image src="/banner.png" alt="banner" width={2000} height={1000} className="w-screen" />
      </div>

      {/* Collections and Product List */}
      <Collections />
      <ProductList />
    </>
  );
}
