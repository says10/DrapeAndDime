type CollectionType = {
  _id: string;
  title: string;
  description: string;
  image: string;
  products: ProductType[];
}

type ProductType = {
  _id: string;
  title: string;
  description: string;
  media: [string];
  category: string;
  collections: [CollectionType];
  tags: [string];
  sizes: string;
  colors: string;
  price: number;
  originalPrice: number;
  expense:number;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
  isAvailable:boolean;
}

type BannerType = {
  _id: string;
  mainBanner: string;
  verticalBanner1: string;
  verticalBanner1Title: string;
  verticalBanner1Subtitle: string;
  verticalBanner1Cta: string;
  verticalBanner1CtaLink: string;
  verticalBanner2: string;
  verticalBanner2Title: string;
  verticalBanner2Subtitle: string;
  verticalBanner2Cta: string;
  verticalBanner2CtaLink: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

type OrderColumnType = {
  _id: string;
  customer: string;
  products: number;
  totalAmount: number;
  createdAt: string;
}


type OrderItemType = {
  product: ProductType
  color: string;
  size: string;
  quantity: number;
}

type CustomerType = {
  clerkId: string;
  name: string;
  email: string;
}
