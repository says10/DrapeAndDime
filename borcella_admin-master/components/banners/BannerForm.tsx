"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
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
import ImageUpload from "../custom ui/ImageUpload";
import { toast } from "sonner";
import Delete from "../custom ui/Delete";

const formSchema = z.object({
  mainBanner: z.string().min(1, "Main banner media is required"),
  mainBannerTitle: z.string().min(1, "Title is required"),
  mainBannerSubtitle: z.string().min(1, "Subtitle is required"),
  mainBannerCta: z.string().min(1, "CTA text is required"),
  mainBannerCtaLink: z.string().min(1, "CTA link is required"),
  
  firstVerticalBanner: z.string().min(1, "First vertical banner media is required"),
  firstVerticalTitle: z.string().min(1, "Title is required"),
  firstVerticalSubtitle: z.string().min(1, "Subtitle is required"),
  firstVerticalCta: z.string().min(1, "CTA text is required"),
  firstVerticalCtaLink: z.string().min(1, "CTA link is required"),
  
  secondVerticalBanner: z.string().min(1, "Second vertical banner media is required"),
  secondVerticalTitle: z.string().min(1, "Title is required"),
  secondVerticalSubtitle: z.string().min(1, "Subtitle is required"),
  secondVerticalCta: z.string().min(1, "CTA text is required"),
  secondVerticalCtaLink: z.string().min(1, "CTA link is required"),
  
  isActive: z.boolean(),
});

interface BannerFormProps {
  initialData?: BannerType | null;
}

const BannerForm: React.FC<BannerFormProps> = ({ initialData }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mainBanner: initialData?.mainBanner || "",
      mainBannerTitle: initialData?.mainBannerTitle || "New Arrivals",
      mainBannerSubtitle: initialData?.mainBannerSubtitle || "Discover the latest trends in women's fashion",
      mainBannerCta: initialData?.mainBannerCta || "Shop Now",
      mainBannerCtaLink: initialData?.mainBannerCtaLink || "/products",
      
      firstVerticalBanner: initialData?.firstVerticalBanner || "",
      firstVerticalTitle: initialData?.firstVerticalTitle || "Elegant Collection",
      firstVerticalSubtitle: initialData?.firstVerticalSubtitle || "Timeless pieces for the modern woman",
      firstVerticalCta: initialData?.firstVerticalCta || "Explore",
      firstVerticalCtaLink: initialData?.firstVerticalCtaLink || "/collections",
      
      secondVerticalBanner: initialData?.secondVerticalBanner || "",
      secondVerticalTitle: initialData?.secondVerticalTitle || "Trendy Styles",
      secondVerticalSubtitle: initialData?.secondVerticalSubtitle || "Stay ahead with our curated fashion selection",
      secondVerticalCta: initialData?.secondVerticalCta || "View Collection",
      secondVerticalCtaLink: initialData?.secondVerticalCtaLink || "/products",
      
      isActive: initialData?.isActive ?? true,
    },
  });

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement> | React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const url = initialData
        ? `/api/banners/${initialData._id}`
        : "/api/banners";
      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify(values),
      });
      if (res.ok) {
        setLoading(false);
        toast.success(`Banner ${initialData ? "updated" : "created"}`);
        window.location.href = "/banners";
        router.push("/banners");
      }
    } catch (err) {
      console.log("[banners_POST]", err);
      toast.error("Something went wrong! Please try again.");
    }
  };

  return (
    <div className="p-10">
      {initialData ? (
        <div className="flex items-center justify-between">
          <p className="text-heading2-bold">Edit Banner</p>
          <Delete id={initialData._id} item="banner" />
        </div>
      ) : (
        <p className="text-heading2-bold">Create Banner</p>
      )}
      <Separator className="bg-grey-1 mt-4 mb-7" />
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Main Banner Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Main Banner (16:9)</h3>
            <Separator />
            
            <FormField
              control={form.control}
              name="mainBanner"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Main Banner Image (16:9)</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value ? [field.value] : []}
                      onChange={(url) => field.onChange(url)}
                      onRemove={() => field.onChange("")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mainBannerTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} onKeyDown={handleKeyPress} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mainBannerSubtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subtitle</FormLabel>
                  <FormControl>
                    <Textarea {...field} onKeyDown={handleKeyPress} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="mainBannerCta"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CTA Text</FormLabel>
                    <FormControl>
                      <Input {...field} onKeyDown={handleKeyPress} />
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
                      <Input {...field} onKeyDown={handleKeyPress} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Vertical Banners Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Vertical Banners (9:16)</h3>
            <Separator />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* First Vertical Banner */}
              <div className="space-y-4">
                <h4 className="text-md font-medium">First Vertical Banner</h4>
                
                <FormField
                  control={form.control}
                  name="firstVerticalBanner"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Vertical Banner Image</FormLabel>
                      <FormControl>
                        <ImageUpload
                          value={field.value ? [field.value] : []}
                          onChange={(url) => field.onChange(url)}
                          onRemove={() => field.onChange("")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="firstVerticalTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} onKeyDown={handleKeyPress} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="firstVerticalSubtitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subtitle</FormLabel>
                      <FormControl>
                        <Textarea {...field} onKeyDown={handleKeyPress} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstVerticalCta"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CTA Text</FormLabel>
                        <FormControl>
                          <Input {...field} onKeyDown={handleKeyPress} />
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
                          <Input {...field} onKeyDown={handleKeyPress} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Second Vertical Banner */}
              <div className="space-y-4">
                <h4 className="text-md font-medium">Second Vertical Banner</h4>
                
                <FormField
                  control={form.control}
                  name="secondVerticalBanner"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Second Vertical Banner Image</FormLabel>
                      <FormControl>
                        <ImageUpload
                          value={field.value ? [field.value] : []}
                          onChange={(url) => field.onChange(url)}
                          onRemove={() => field.onChange("")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="secondVerticalTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} onKeyDown={handleKeyPress} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="secondVerticalSubtitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subtitle</FormLabel>
                      <FormControl>
                        <Textarea {...field} onKeyDown={handleKeyPress} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="secondVerticalCta"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CTA Text</FormLabel>
                        <FormControl>
                          <Input {...field} onKeyDown={handleKeyPress} />
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
                          <Input {...field} onKeyDown={handleKeyPress} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Active Status */}
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Active Status</FormLabel>
                  <div className="text-sm text-muted-foreground">
                    Enable or disable this banner
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

          <div className="flex gap-10">
            <Button type="submit" className="bg-blue-1 text-white" disabled={loading}>
              {loading ? "Loading..." : "Submit"}
            </Button>
            <Button
              type="button"
              onClick={() => router.push("/banners")}
              className="bg-blue-1 text-white"
            >
              Discard
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default BannerForm; 