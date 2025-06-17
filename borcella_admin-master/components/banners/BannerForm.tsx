"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import VideoUpload from "../custom ui/VideoUpload";
import { toast } from "sonner";
import { Loader } from "lucide-react";

const formSchema = z.object({
  mainBanner: z.string().min(1, "Main banner video is required"),
  mainBannerTitle: z.string().min(1, "Title is required"),
  mainBannerSubtitle: z.string().min(1, "Subtitle is required"),
  mainBannerCta: z.string().min(1, "CTA text is required"),
  mainBannerCtaLink: z.string().min(1, "CTA link is required"),
  
  firstVerticalBanner: z.string().min(1, "First vertical banner video is required"),
  firstVerticalTitle: z.string().min(1, "Title is required"),
  firstVerticalSubtitle: z.string().min(1, "Subtitle is required"),
  firstVerticalCta: z.string().min(1, "CTA text is required"),
  firstVerticalCtaLink: z.string().min(1, "CTA link is required"),
  
  secondVerticalBanner: z.string().min(1, "Second vertical banner video is required"),
  secondVerticalTitle: z.string().min(1, "Title is required"),
  secondVerticalSubtitle: z.string().min(1, "Subtitle is required"),
  secondVerticalCta: z.string().min(1, "CTA text is required"),
  secondVerticalCtaLink: z.string().min(1, "CTA link is required"),
  
  isActive: z.boolean(),
});

interface BannerFormProps {
  banner?: BannerType | null;
  onClose: () => void;
}

const BannerForm = ({ banner, onClose }: BannerFormProps) => {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mainBanner: banner?.mainBanner || "",
      mainBannerTitle: banner?.mainBannerTitle || "New Arrivals",
      mainBannerSubtitle: banner?.mainBannerSubtitle || "Discover the latest trends in women's fashion",
      mainBannerCta: banner?.mainBannerCta || "Shop Now",
      mainBannerCtaLink: banner?.mainBannerCtaLink || "/products",
      
      firstVerticalBanner: banner?.firstVerticalBanner || "",
      firstVerticalTitle: banner?.firstVerticalTitle || "Elegant Collection",
      firstVerticalSubtitle: banner?.firstVerticalSubtitle || "Timeless pieces for the modern woman",
      firstVerticalCta: banner?.firstVerticalCta || "Explore",
      firstVerticalCtaLink: banner?.firstVerticalCtaLink || "/collections",
      
      secondVerticalBanner: banner?.secondVerticalBanner || "",
      secondVerticalTitle: banner?.secondVerticalTitle || "Trendy Styles",
      secondVerticalSubtitle: banner?.secondVerticalSubtitle || "Stay ahead with our curated fashion selection",
      secondVerticalCta: banner?.secondVerticalCta || "View Collection",
      secondVerticalCtaLink: banner?.secondVerticalCtaLink || "/products",
      
      isActive: banner?.isActive ?? true,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      
      const url = banner ? `/api/banners/${banner._id}` : "/api/banners";
      const method = banner ? "PATCH" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Failed to save banner");
      }

      toast.success(banner ? "Banner updated successfully" : "Banner created successfully");
      onClose();
    } catch (error) {
      console.error("Error saving banner:", error);
      toast.error("Failed to save banner");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {banner ? "Edit Banner" : "Create New Banner"}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Main Banner Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Main Banner (16:9)</h3>
              <Separator />
              
              <FormField
                control={form.control}
                name="mainBanner"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Main Banner Video (16:9)</FormLabel>
                    <FormControl>
                      <VideoUpload
                        value={field.value}
                        onChange={field.onChange}
                        onRemove={() => field.onChange("")}
                        aspectRatio="16:9"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="mainBannerTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mainBannerCta"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CTA Text</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="mainBannerSubtitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subtitle</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mainBannerCtaLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CTA Link</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="/products" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* First Vertical Banner Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">First Vertical Banner (9:16)</h3>
              <Separator />
              
              <FormField
                control={form.control}
                name="firstVerticalBanner"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Vertical Banner Video (9:16)</FormLabel>
                    <FormControl>
                      <VideoUpload
                        value={field.value}
                        onChange={field.onChange}
                        onRemove={() => field.onChange("")}
                        aspectRatio="9:16"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstVerticalTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="firstVerticalCta"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CTA Text</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="firstVerticalSubtitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subtitle</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="firstVerticalCtaLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CTA Link</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="/collections" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Second Vertical Banner Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Second Vertical Banner (9:16)</h3>
              <Separator />
              
              <FormField
                control={form.control}
                name="secondVerticalBanner"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Second Vertical Banner Video (9:16)</FormLabel>
                    <FormControl>
                      <VideoUpload
                        value={field.value}
                        onChange={field.onChange}
                        onRemove={() => field.onChange("")}
                        aspectRatio="9:16"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="secondVerticalTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="secondVerticalCta"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CTA Text</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="secondVerticalSubtitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subtitle</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="secondVerticalCtaLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CTA Link</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="/products" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Status */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Status</h3>
              <Separator />
              
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Enable this banner to be displayed on the website
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                {banner ? "Update Banner" : "Create Banner"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default BannerForm; 