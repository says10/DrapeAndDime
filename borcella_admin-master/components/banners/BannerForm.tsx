"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useRouter } from "next/navigation";
import ImageUpload from "../custom ui/ImageUpload";
import { useState } from "react";
import toast from "react-hot-toast";
import Delete from "../custom ui/Delete";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  mainBanner: z.string(),
  mainBannerType: z.enum(['image', 'video']),
  verticalBanner1: z.string(),
  verticalBanner1Type: z.enum(['image', 'video']),
  verticalBanner1Title: z.string(),
  verticalBanner1Subtitle: z.string(),
  verticalBanner1Cta: z.string(),
  verticalBanner1CtaLink: z.string(),
  verticalBanner2: z.string(),
  verticalBanner2Type: z.enum(['image', 'video']),
  verticalBanner2Title: z.string(),
  verticalBanner2Subtitle: z.string(),
  verticalBanner2Cta: z.string(),
  verticalBanner2CtaLink: z.string(),
  isActive: z.boolean().default(false),
});

interface BannerFormProps {
  initialData?: BannerType | null;
}

const BannerForm: React.FC<BannerFormProps> = ({ initialData }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          mainBanner: initialData.mainBanner || "",
          mainBannerType: initialData.mainBannerType || "image",
          verticalBanner1: initialData.verticalBanner1 || "",
          verticalBanner1Type: initialData.verticalBanner1Type || "image",
          verticalBanner1Title: initialData.verticalBanner1Title || "",
          verticalBanner1Subtitle: initialData.verticalBanner1Subtitle || "",
          verticalBanner1Cta: initialData.verticalBanner1Cta || "",
          verticalBanner1CtaLink: initialData.verticalBanner1CtaLink || "",
          verticalBanner2: initialData.verticalBanner2 || "",
          verticalBanner2Type: initialData.verticalBanner2Type || "image",
          verticalBanner2Title: initialData.verticalBanner2Title || "",
          verticalBanner2Subtitle: initialData.verticalBanner2Subtitle || "",
          verticalBanner2Cta: initialData.verticalBanner2Cta || "",
          verticalBanner2CtaLink: initialData.verticalBanner2CtaLink || "",
          isActive: initialData.isActive ?? false,
        }
      : {
          mainBanner: "",
          mainBannerType: "image",
          verticalBanner1: "",
          verticalBanner1Type: "image",
          verticalBanner1Title: "",
          verticalBanner1Subtitle: "",
          verticalBanner1Cta: "",
          verticalBanner1CtaLink: "",
          verticalBanner2: "",
          verticalBanner2Type: "image",
          verticalBanner2Title: "",
          verticalBanner2Subtitle: "",
          verticalBanner2Cta: "",
          verticalBanner2CtaLink: "",
          isActive: false,
        },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const url = initialData
        ? `/api/banners/${initialData._id}`
        : "/api/banners";
      const method = initialData ? "PATCH" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (res.ok) {
        setLoading(false);
        toast.success(`Banner ${initialData ? "updated" : "created"}`);
        window.location.href = "/banners";
        router.push("/banners");
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Something went wrong!");
      }
    } catch (err) {
      console.log("[banners_POST]", err);
      toast.error("Something went wrong! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          {initialData ? (
            <div className="flex items-center gap-4">
              <p className="text-heading2-bold">Edit Banner</p>
              <Delete id={initialData._id} item="banner" />
            </div>
          ) : (
            <p className="text-heading2-bold">Create Banner</p>
          )}
        </div>
        
        <div className="flex gap-3">
          <Button 
            type="button"
            onClick={() => router.push("/banners")}
            variant="outline"
            className="bg-white text-gray-700 hover:bg-gray-50"
          >
            Discard
          </Button>
          <Button 
            type="button"
            onClick={form.handleSubmit(onSubmit)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      <Separator className="mb-6" />
      
      <Form {...form}>
        <form className="space-y-6">
          {/* Active Toggle */}
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center gap-3">
                <FormLabel>Active</FormLabel>
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                    className="w-5 h-5 rounded border-gray-300 focus:ring-blue-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Main Banner */}
          <FormField
            control={form.control}
            name="mainBannerType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Media Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select media type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mainBanner"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-semibold">Main Banner (16:9)</FormLabel>
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
          
          {/* Vertical Banners - Side by Side */}
          <div>
            <FormLabel className="text-lg font-semibold">Vertical Banners (9:16)</FormLabel>
            <p className="text-xs text-blue-600 mb-2">Note: These vertical banners are displayed <b>only on the mobile version</b> of the store homepage.</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
              {/* First Vertical Banner */}
              <div className="space-y-4">
                <h4 className="text-base font-medium">First Vertical Banner</h4>
                
                <FormField
                  control={form.control}
                  name="verticalBanner1Type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Media Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select media type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="image">Image</SelectItem>
                          <SelectItem value="video">Video</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="verticalBanner1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Media</FormLabel>
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
                  name="verticalBanner1Title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="verticalBanner1Subtitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subtitle</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter subtitle" rows={2} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="verticalBanner1Cta"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CTA Text</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Shop Now" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="verticalBanner1CtaLink"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CTA Link</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., /collections" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Second Vertical Banner */}
              <div className="space-y-4">
                <h4 className="text-base font-medium">Second Vertical Banner</h4>
                
                <FormField
                  control={form.control}
                  name="verticalBanner2Type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Media Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select media type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="image">Image</SelectItem>
                          <SelectItem value="video">Video</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="verticalBanner2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Media</FormLabel>
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
                  name="verticalBanner2Title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="verticalBanner2Subtitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subtitle</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter subtitle" rows={2} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="verticalBanner2Cta"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CTA Text</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Shop Now" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="verticalBanner2CtaLink"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CTA Link</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., /collections" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default BannerForm; 