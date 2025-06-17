"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const BannersPage = () => {
  const router = useRouter();
  const [banners, setBanners] = useState<BannerType[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingBanner, setViewingBanner] = useState<BannerType | null>(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await fetch("/api/banners");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setBanners(data);
    } catch (error) {
      console.error("Error fetching banners:", error);
      toast.error("Failed to fetch banners");
    } finally {
      setLoading(false);
    }
  };

  const handleAddBanner = () => {
    router.push("/banners/new");
  };

  const handleEditBanner = (banner: BannerType) => {
    router.push(`/banners/${banner._id}`);
  };

  const handleViewBanner = (banner: BannerType) => {
    setViewingBanner(banner);
  };

  const handleDeleteBanner = async (bannerId: string) => {
    if (!confirm("Are you sure you want to delete this banner?")) {
      return;
    }

    try {
      const response = await fetch(`/api/banners/${bannerId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete banner");
      }

      toast.success("Banner deleted successfully");
      fetchBanners();
    } catch (error) {
      console.error("Error deleting banner:", error);
      toast.error("Failed to delete banner");
    }
  };

  const handleViewClose = () => {
    setViewingBanner(null);
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
            Manage your banner media content
          </p>
        </div>
        <Button onClick={handleAddBanner}>
          <Plus className="mr-2 h-4 w-4" />
          Add Banner
        </Button>
      </div>
      <Separator className="my-4" />

      {/* Banners List */}
      <div className="space-y-4">
        {banners.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <p className="text-muted-foreground mb-4">No banners found</p>
              <Button onClick={handleAddBanner}>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Banner
              </Button>
            </CardContent>
          </Card>
        ) : (
          banners.map((banner) => (
            <Card key={banner._id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    Banner Configuration
                    {banner.isActive && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    )}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewBanner(banner)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditBanner(banner)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteBanner(banner._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Main Banner */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Main Banner (16:9)</h4>
                    <p className="text-sm text-muted-foreground">
                      {banner.mainBanner ? "Media uploaded" : "No media"}
                    </p>
                    {banner.mainBannerType && (
                      <p className="text-xs text-muted-foreground">
                        Type: {banner.mainBannerType}
                      </p>
                    )}
                  </div>

                  {/* First Vertical Banner */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Vertical Banner 1 (9:16)</h4>
                    <p className="text-sm text-muted-foreground">
                      {banner.verticalBanner1 ? "Media uploaded" : "No media"}
                    </p>
                    {banner.verticalBanner1Type && (
                      <p className="text-xs text-muted-foreground">
                        Type: {banner.verticalBanner1Type}
                      </p>
                    )}
                    {banner.verticalBanner1Title && (
                      <p className="text-xs text-muted-foreground">
                        Title: {banner.verticalBanner1Title}
                      </p>
                    )}
                  </div>

                  {/* Second Vertical Banner */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Vertical Banner 2 (9:16)</h4>
                    <p className="text-sm text-muted-foreground">
                      {banner.verticalBanner2 ? "Media uploaded" : "No media"}
                    </p>
                    {banner.verticalBanner2Type && (
                      <p className="text-xs text-muted-foreground">
                        Type: {banner.verticalBanner2Type}
                      </p>
                    )}
                    {banner.verticalBanner2Title && (
                      <p className="text-xs text-muted-foreground">
                        Title: {banner.verticalBanner2Title}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Banner Preview Dialog */}
      {viewingBanner && (
        <Dialog open={true} onOpenChange={handleViewClose}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Banner Preview</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Main Banner Preview */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Main Banner (16:9)</h3>
                <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  {viewingBanner.mainBanner ? (
                    viewingBanner.mainBannerType === 'video' ? (
                      <video
                        src={viewingBanner.mainBanner}
                        className="w-full h-full object-cover"
                        autoPlay
                        loop
                        muted
                        playsInline
                      />
                    ) : (
                      <Image
                        src={viewingBanner.mainBanner}
                        alt="Main banner"
                        className="w-full h-full object-cover"
                        fill
                        sizes="(max-width: 768px) 100vw, 80vw"
                      />
                    )
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      No media uploaded
                    </div>
                  )}
                </div>
              </div>

              {/* Vertical Banners Preview - Side by Side */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Vertical Banners (9:16)</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                  {/* First Vertical Banner */}
                  <div className="space-y-2">
                    <h4 className="text-md font-medium text-center">First Option</h4>
                    <div className="relative aspect-[9/16] bg-gray-100 rounded-lg overflow-hidden">
                      {viewingBanner.verticalBanner1 ? (
                        viewingBanner.verticalBanner1Type === 'image' ? (
                          <Image
                            src={viewingBanner.verticalBanner1}
                            alt="First vertical banner"
                            className="w-full h-full object-cover"
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        ) : (
                          <video
                            src={viewingBanner.verticalBanner1}
                            className="w-full h-full object-cover"
                            autoPlay
                            loop
                            muted
                            playsInline
                          />
                        )
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                          No media uploaded
                        </div>
                      )}
                      {(viewingBanner.verticalBanner1Title || viewingBanner.verticalBanner1Subtitle || viewingBanner.verticalBanner1Cta) && (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      )}
                      {(viewingBanner.verticalBanner1Title || viewingBanner.verticalBanner1Subtitle || viewingBanner.verticalBanner1Cta) && (
                        <div className="absolute bottom-4 left-4 text-white">
                          {viewingBanner.verticalBanner1Title && (
                            <h5 className="text-lg font-bold mb-1">{viewingBanner.verticalBanner1Title}</h5>
                          )}
                          {viewingBanner.verticalBanner1Subtitle && (
                            <p className="text-sm mb-2 max-w-xs">{viewingBanner.verticalBanner1Subtitle}</p>
                          )}
                          {viewingBanner.verticalBanner1Cta && (
                            <Button size="sm" className="bg-white text-black hover:bg-gray-100">
                              {viewingBanner.verticalBanner1Cta}
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Center Text */}
                  <div className="flex flex-col items-center justify-center space-y-4 py-8">
                    <div className="text-center">
                      <h4 className="text-2xl font-bold text-gray-800 mb-2">Which one do you choose?</h4>
                      <p className="text-gray-600 text-sm">Select your preferred style</p>
                    </div>
                    <div className="w-16 h-1 bg-gradient-to-r from-transparent via-gray-400 to-transparent rounded-full"></div>
                  </div>

                  {/* Second Vertical Banner */}
                  <div className="space-y-2">
                    <h4 className="text-md font-medium text-center">Second Option</h4>
                    <div className="relative aspect-[9/16] bg-gray-100 rounded-lg overflow-hidden">
                      {viewingBanner.verticalBanner2 ? (
                        viewingBanner.verticalBanner2Type === 'image' ? (
                          <Image
                            src={viewingBanner.verticalBanner2}
                            alt="Second vertical banner"
                            className="w-full h-full object-cover"
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        ) : (
                          <video
                            src={viewingBanner.verticalBanner2}
                            className="w-full h-full object-cover"
                            autoPlay
                            loop
                            muted
                            playsInline
                          />
                        )
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                          No media uploaded
                        </div>
                      )}
                      {(viewingBanner.verticalBanner2Title || viewingBanner.verticalBanner2Subtitle || viewingBanner.verticalBanner2Cta) && (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      )}
                      {(viewingBanner.verticalBanner2Title || viewingBanner.verticalBanner2Subtitle || viewingBanner.verticalBanner2Cta) && (
                        <div className="absolute bottom-4 left-4 text-white">
                          {viewingBanner.verticalBanner2Title && (
                            <h5 className="text-lg font-bold mb-1">{viewingBanner.verticalBanner2Title}</h5>
                          )}
                          {viewingBanner.verticalBanner2Subtitle && (
                            <p className="text-sm mb-2 max-w-xs">{viewingBanner.verticalBanner2Subtitle}</p>
                          )}
                          {viewingBanner.verticalBanner2Cta && (
                            <Button size="sm" className="bg-white text-black hover:bg-gray-100">
                              {viewingBanner.verticalBanner2Cta}
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Banner Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Banner Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>Status:</strong> {viewingBanner.isActive ? "Active" : "Inactive"}</p>
                    <p><strong>Created:</strong> {new Date(viewingBanner.createdAt).toLocaleDateString()}</p>
                    <p><strong>Updated:</strong> {new Date(viewingBanner.updatedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default BannersPage; 