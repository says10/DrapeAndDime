interface ProductType {
  _id: string;
  title: string;
  description: string;
  media: string[];
  category: string;
  collections: CollectionType[];
  tags: string[];
  sizes: string;
  colors: string;
  price: number;
  originalPrice?: number; // optional MRP (original price)
  expense: number;
  quantity: number;
  isAvailable?: boolean;
} 