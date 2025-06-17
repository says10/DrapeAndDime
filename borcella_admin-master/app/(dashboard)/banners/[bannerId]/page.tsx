"use client";

import { useEffect, useState } from "react";
import BannerForm from "@/components/banners/BannerForm";
import Loader from "@/components/custom ui/Loader";
import { toast } from "sonner";

const EditBanner = ({ params }: { params: { bannerId: string } }) => {
  const [banner, setBanner] = useState<BannerType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await fetch(`/api/banners/${params.bannerId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch banner");
        }
        const data = await response.json();
        setBanner(data);
      } catch (error) {
        console.error("Error fetching banner:", error);
        toast.error("Failed to fetch banner");
      } finally {
        setLoading(false);
      }
    };

    fetchBanner();
  }, [params.bannerId]);

  if (loading) {
    return <Loader />;
  }

  if (!banner) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Banner not found</p>
      </div>
    );
  }

  return <BannerForm initialData={banner} />;
};

export default EditBanner; 