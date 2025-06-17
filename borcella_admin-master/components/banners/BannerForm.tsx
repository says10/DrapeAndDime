"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";

import { Separator } from "../ui/separator";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ImageUpload from "../custom ui/ImageUpload";
import { useState } from "react";
import toast from "react-hot-toast";
import Delete from "../custom ui/Delete";

const formSchema = z.object({
  mainBanner: z.string(),
  mainBannerType: z.enum(['image', 'video']),
  verticalBanner1: z.string(),
  verticalBanner1Type: z.enum(['image', 'video']),
  verticalBanner2: z.string(),
  verticalBanner2Type: z.enum(['image', 'video']),
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
          mainBannerType: initialData.mainBannerType || 'image',
          verticalBanner1: initialData.verticalBanner1 || "",
          verticalBanner1Type: initialData.verticalBanner1Type || 'image',
          verticalBanner2: initialData.verticalBanner2 || "",
          verticalBanner2Type: initialData.verticalBanner2Type || 'image',
        }
      : {
          mainBanner: "",
          mainBannerType: 'image',
          verticalBanner1: "",
          verticalBanner1Type: 'image',
          verticalBanner2: "",
          verticalBanner2Type: 'image',
        },
  });

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
          <FormField
            control={form.control}
            name="mainBanner"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Main Banner (16:9)</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value ? [field.value] : []}
                    onChange={(url) => {
                      field.onChange(url);
                      // Auto-detect media type from URL
                      const isVideo = url.match(/\.(mp4|webm|ogg|mov|avi|wmv|flv|mkv)$/i) || url.includes('/video/');
                      form.setValue('mainBannerType', isVideo ? 'video' : 'image');
                    }}
                    onRemove={() => field.onChange("")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="verticalBanner1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vertical Banner 1 (9:16)</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value ? [field.value] : []}
                    onChange={(url) => {
                      field.onChange(url);
                      // Auto-detect media type from URL
                      const isVideo = url.match(/\.(mp4|webm|ogg|mov|avi|wmv|flv|mkv)$/i) || url.includes('/video/');
                      form.setValue('verticalBanner1Type', isVideo ? 'video' : 'image');
                    }}
                    onRemove={() => field.onChange("")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="verticalBanner2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vertical Banner 2 (9:16)</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value ? [field.value] : []}
                    onChange={(url) => {
                      field.onChange(url);
                      // Auto-detect media type from URL
                      const isVideo = url.match(/\.(mp4|webm|ogg|mov|avi|wmv|flv|mkv)$/i) || url.includes('/video/');
                      form.setValue('verticalBanner2Type', isVideo ? 'video' : 'image');
                    }}
                    onRemove={() => field.onChange("")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-10">
            <Button 
              type="submit" 
              className="bg-blue-1 text-white"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
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