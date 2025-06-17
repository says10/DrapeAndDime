type CollectionType = {
  _id: string;
  title: string;
  description: string;
  image: string;
  products: ProductType[];
};

type ProductType = {
  _id: string;
  title: string;
  description: string;
  media: [string];
  category: string;
  collections: [string];
  tags: [string];
  price: number;
  originalPrice?: number;
  cost: number;
  sizes: string;
  colors: string;
  createdAt: string;
  updatedAt: string;
  quantity:number;
  isAvailable:boolean;
};

type UserType = {
  clerkId: string;
  wishlist: [string];
  createdAt: string;
  updatedAt: string;
};

type OrderType = {
  shippingAddress: Object;
  _id: string;
  customerClerkId: string;
  products: [OrderItemType]
  shippingRate: string;
  totalAmount: number;
  createdAt:string;
  status:string;
  trackingLink:string;

}

type OrderItemType = {
  product: ProductType;
  color: string;
  size: string;
  quantity: number;
  _id: string;
}

type BannerType = {
  _id: string;
  mainBanner: string;
  verticalBanner1: string;
  verticalBanner1Type: 'image' | 'video';
  verticalBanner1Title: string;
  verticalBanner1Subtitle: string;
  verticalBanner1Cta: string;
  verticalBanner1CtaLink: string;
  verticalBanner2: string;
  verticalBanner2Type: 'image' | 'video';
  verticalBanner2Title: string;
  verticalBanner2Subtitle: string;
  verticalBanner2Cta: string;
  verticalBanner2CtaLink: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};