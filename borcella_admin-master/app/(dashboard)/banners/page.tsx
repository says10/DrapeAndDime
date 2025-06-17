"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import BannerForm from "@/components/banners/BannerForm";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const BannersPage = () => {
  const [banners, setBanners] = useState<BannerType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState<BannerType | null>(null);
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
    setEditingBanner(null);
    setShowForm(true);
  };

  const handleEditBanner = (banner: BannerType) => {
    setEditingBanner(banner);
    setShowForm(true);
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

  const handleFormClose = () => {
    setShowForm(false);
    setEditingBanner(null);
    fetchBanners(); // Refresh the list after form closes
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
            Manage your banner videos and content
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
                      {banner.mainBannerTitle}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {banner.mainBannerSubtitle}
                    </p>
                  </div>

                  {/* First Vertical Banner */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">First Vertical (9:16)</h4>
                    <p className="text-sm text-muted-foreground">
                      {banner.firstVerticalTitle}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {banner.firstVerticalSubtitle}
                    </p>
                  </div>

                  {/* Second Vertical Banner */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Second Vertical (9:16)</h4>
                    <p className="text-sm text-muted-foreground">
                      {banner.secondVerticalTitle}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {banner.secondVerticalSubtitle}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Banner Form Dialog */}
      {showForm && (
        <BannerForm
          banner={editingBanner}
          onClose={handleFormClose}
        />
      )}

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
                    <video
                      src={viewingBanner.mainBanner}
                      className="w-full h-full object-cover"
                      controls
                      autoPlay
                      muted
                      loop
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      No video uploaded
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <h4 className="text-2xl font-bold mb-2">{viewingBanner.mainBannerTitle}</h4>
                    <p className="text-lg mb-4 max-w-md">{viewingBanner.mainBannerSubtitle}</p>
                    <Button className="bg-white text-black hover:bg-gray-100">
                      {viewingBanner.mainBannerCta}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Vertical Banners Preview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Vertical Banner */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">First Vertical Banner (9:16)</h3>
                  <div className="relative aspect-[9/16] bg-gray-100 rounded-lg overflow-hidden">
                    {viewingBanner.firstVerticalBanner ? (
                      <video
                        src={viewingBanner.firstVerticalBanner}
                        className="w-full h-full object-cover"
                        controls
                        autoPlay
                        muted
                        loop
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        No video uploaded
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h4 className="text-lg font-bold mb-1">{viewingBanner.firstVerticalTitle}</h4>
                      <p className="text-sm mb-2 max-w-xs">{viewingBanner.firstVerticalSubtitle}</p>
                      <Button size="sm" className="bg-white text-black hover:bg-gray-100">
                        {viewingBanner.firstVerticalCta}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Second Vertical Banner */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Second Vertical Banner (9:16)</h3>
                  <div className="relative aspect-[9/16] bg-gray-100 rounded-lg overflow-hidden">
                    {viewingBanner.secondVerticalBanner ? (
                      <video
                        src={viewingBanner.secondVerticalBanner}
                        className="w-full h-full object-cover"
                        controls
                        autoPlay
                        muted
                        loop
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        No video uploaded
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h4 className="text-lg font-bold mb-1">{viewingBanner.secondVerticalTitle}</h4>
                      <p className="text-sm mb-2 max-w-xs">{viewingBanner.secondVerticalSubtitle}</p>
                      <Button size="sm" className="bg-white text-black hover:bg-gray-100">
                        {viewingBanner.secondVerticalCta}
                      </Button>
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
                  <div>
                    <p><strong>Main CTA Link:</strong> {viewingBanner.mainBannerCtaLink}</p>
                    <p><strong>First Vertical CTA Link:</strong> {viewingBanner.firstVerticalCtaLink}</p>
                    <p><strong>Second Vertical CTA Link:</strong> {viewingBanner.secondVerticalCtaLink}</p>
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