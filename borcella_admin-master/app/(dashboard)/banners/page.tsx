"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import BannerForm from "@/components/banners/BannerForm";
import { toast } from "sonner";

const BannersPage = () => {
  const router = useRouter();
  const [banners, setBanners] = useState<BannerType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<BannerType | null>(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await fetch("/api/banners");
      const data = await response.json();
      setBanners(data);
    } catch (error) {
      console.error("Error fetching banners:", error);
      toast.error("Failed to fetch banners");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (banner: BannerType) => {
    setSelectedBanner(banner);
    setShowForm(true);
  };

  const handleCreate = () => {
    setSelectedBanner(null);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedBanner(null);
    fetchBanners();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Banners</h1>
          <p className="text-muted-foreground">
            Manage your banner videos and content
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add Banner
        </Button>
      </div>
      <Separator className="my-4" />

      {banners.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <p className="text-muted-foreground mb-4">No banners found</p>
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Create your first banner
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {banners.map((banner) => (
            <Card key={banner._id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Banner Configuration</span>
                  <div className={`w-3 h-3 rounded-full ${banner.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium">Main Banner (16:9)</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {banner.mainBanner || "Not set"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Vertical Banners (9:16)</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {banner.firstVerticalBanner || "Not set"} | {banner.secondVerticalBanner || "Not set"}
                    </p>
                  </div>
                  <div className="pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEdit(banner)}
                      className="w-full"
                    >
                      Edit Banner
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {showForm && (
        <BannerForm 
          banner={selectedBanner} 
          onClose={handleFormClose} 
        />
      )}
    </div>
  );
};

export default BannersPage; 