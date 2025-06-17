"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { toast } from "sonner";

const BannersPage = () => {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
      toast.success("Banners loaded successfully");
    } catch (error) {
      console.error("Error fetching banners:", error);
      toast.error("Failed to fetch banners");
    } finally {
      setLoading(false);
    }
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
        <Button onClick={() => toast.info("Add banner functionality coming soon")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Banner
        </Button>
      </div>
      <Separator className="my-4" />

      <Card>
        <CardHeader>
          <CardTitle>Banners Status</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-green-600 font-medium">✅ Banners page is working!</p>
          <p className="text-sm text-gray-600 mt-2">
            Found {banners.length} banner(s) in database
          </p>
          <Button onClick={fetchBanners} className="mt-4">
            Refresh Banners
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default BannersPage; 