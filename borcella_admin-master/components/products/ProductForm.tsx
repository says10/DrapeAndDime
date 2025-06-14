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
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import ImageUpload from "../custom ui/ImageUpload";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Delete from "../custom ui/Delete";
import MultiText from "../custom ui/MultiText";
import MultiSelect from "../custom ui/MultiSelect";
import Loader from "../custom ui/Loader";
import RichTextEditor from "../custom ui/RichTextEditor";

const formSchema = z.object({
  title: z.string().min(2).max(200),
  description: z.string().min(2).max(2000),
  media: z.array(z.string()),
  category: z.string(),
  collections: z.array(z.string()),
  tags: z.array(z.string()),
  sizes: z.string(),
  colors: z.string(),
  price: z.coerce.number().min(0.1),
  originalPrice: z.coerce.number().min(0.1).optional(),
  expense: z.coerce.number().min(0.1),
  quantity: z.coerce.number().min(0), // Quantity must be a non-negative number
  isAvailable: z.boolean().optional(), // Optional as it defaults to true in schema
});

interface ProductFormProps {
  initialData?: ProductType | null; // Must have "?" to make it optional
}

const ProductForm: React.FC<ProductFormProps> = ({ initialData }) => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [collections, setCollections] = useState<CollectionType[]>([]);

  const getCollections = async () => {
    try {
      const res = await fetch("/api/collections", {
        method: "GET",
      });
      const data = await res.json();
      setCollections(data);
      setLoading(false);
    } catch (err) {
      console.log("[collections_GET]", err);
      toast.error("Something went wrong! Please try again.");
    }
  };

  useEffect(() => {
    getCollections();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          collections: initialData.collections.map(
            (collection) => collection._id
          ),
          isAvailable: initialData.isAvailable ?? true, // Ensure default is true if not provided
        }
      : {
          title: "",
          description: "",
          media: [],
          category: "",
          collections: [],
          tags: [],
          sizes: "",
          colors: "",
          price: 0.1,
          originalPrice: undefined,
          expense: 0.1,
          quantity: 0, // Default to 0 for new products
          isAvailable: true, // Default to available
        },
  });

  const handleKeyPress = (
    e:
      | React.KeyboardEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const url = initialData
        ? `/api/products/${initialData._id}`
        : "/api/products";
      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify(values),
      });
      if (res.ok) {
        setLoading(false);
        toast.success(`Product ${initialData ? "updated" : "created"}`);
        window.location.href = "/products";
        router.push("/products");
      }
    } catch (err) {
      console.log("[products_POST]", err);
      toast.error("Something went wrong! Please try again.");
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="p-10">
      {initialData ? (
        <div className="flex items-center justify-between">
          <p className="text-heading2-bold">Edit Product</p>
          <Delete id={initialData._id} item="product" />
        </div>
      ) : (
        <p className="text-heading2-bold">Create Product</p>
      )}
      <Separator className="bg-grey-1 mt-4 mb-7" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Title"
                    {...field}
                    onKeyDown={handleKeyPress}
                  />
                </FormControl>
                <FormMessage className="text-red-1" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <RichTextEditor
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Write your product description here..."
                  />
                </FormControl>
                <FormMessage className="text-red-1" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="media"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value}
                    onChange={(url) => field.onChange([...field.value, url])}
                    onRemove={(url) =>
                      field.onChange([field.value.filter((image) => image !== url)])
                    }
                  />
                </FormControl>
                <FormMessage className="text-red-1" />
              </FormItem>
            )}
          />

          <div className="md:grid md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (₹)</FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-2">
                      <Input
                        type="number"
                        placeholder="Price"
                        {...field}
                        onKeyDown={handleKeyPress}
                      />
                      {form.watch("originalPrice") && (
                        <div className="text-sm text-grey-2">
                          Original Price: <span className="line-through">₹{form.watch("originalPrice")}</span>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-1" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="originalPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Original Price (₹)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Original Price (optional)"
                      {...field}
                      onKeyDown={handleKeyPress}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Only allow original price if it's higher than current price
                        if (!value || parseFloat(value) > form.watch("price")) {
                          field.onChange(value);
                        } else {
                          toast.error("Original price must be higher than current price");
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage className="text-red-1" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="expense"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expense (₹)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Expense"
                      {...field}
                      onKeyDown={handleKeyPress}
                    />
                  </FormControl>
                  <FormMessage className="text-red-1" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Category"
                      {...field}
                      onKeyDown={handleKeyPress}
                    />
                  </FormControl>
                  <FormMessage className="text-red-1" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <MultiText
                      placeholder="Tags"
                      value={field.value}
                      onChange={(tag) => field.onChange([...field.value, tag])}
                      onRemove={(tagToRemove) =>
                        field.onChange([field.value.filter((tag) => tag !== tagToRemove)])
                      }
                    />
                  </FormControl>
                  <FormMessage className="text-red-1" />
                </FormItem>
              )}
            />
            {collections.length > 0 && (
              <FormField
                control={form.control}
                name="collections"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Collections</FormLabel>
                    <FormControl>
                      <MultiSelect
                        placeholder="Collections"
                        collections={collections}
                        value={field.value}
                        onChange={(_id) =>
                          field.onChange([...field.value, _id])
                        }
                        onRemove={(idToRemove) =>
                          field.onChange([field.value.filter((collectionId) => collectionId !== idToRemove)])
                        }
                      />
                    </FormControl>
                    <FormMessage className="text-red-1" />
                  </FormItem>
                )}
              />
            )}
 <FormField
  control={form.control}
  name="colors"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Colors</FormLabel>
      <FormControl>
        {/* Single text input for colors */}
        <input
          type="text"
          placeholder="Colors"
          value={field.value || ""}
          onChange={(e) => field.onChange(e.target.value)}
          className="border border-gray-300 p-2 rounded"
        />
      </FormControl>
      <FormMessage className="text-red-1" />
    </FormItem>
  )}
/>

<FormField
  control={form.control}
  name="sizes"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Sizes</FormLabel>
      <FormControl>
        {/* Single text input for sizes */}
        <input
          type="text"
          placeholder="Sizes"
          value={field.value || ""}
          onChange={(e) => field.onChange(e.target.value)}
          className="border border-gray-300 p-2 rounded"
        />
      </FormControl>
      <FormMessage className="text-red-1" />
    </FormItem>
  )}
/>

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Quantity"
                      {...field}
                      onKeyDown={handleKeyPress}
                    />
                  </FormControl>
                  <FormMessage className="text-red-1" />
                </FormItem>
              )}
            />
            <FormField
  control={form.control}
  name="isAvailable"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Available</FormLabel>
      <FormControl>
        <input
          type="checkbox"
          checked={field.value || false}
          onChange={(e) => field.onChange(e.target.checked)}
          className="w-5 h-5"
        />
      </FormControl>
      <FormMessage className="text-red-1" />
    </FormItem>
  )}
/>

          </div>

          <div className="flex gap-10">
            <Button type="submit" className="bg-blue-1 text-white">
              Submit
            </Button>
            <Button
              type="button"
              onClick={() => router.push("/products")}
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

export default ProductForm;
