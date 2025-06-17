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
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
  isAvailable:boolean;
}

type BannerType = {
  _id: string;
  mainBanner: string;
  mainBannerTitle: string;
  mainBannerSubtitle: string;
  mainBannerCta: string;
  mainBannerCtaLink: string;
  firstVerticalBanner: string;
  firstVerticalTitle: string;
  firstVerticalSubtitle: string;
  firstVerticalCta: string;
  firstVerticalCtaLink: string;
  secondVerticalBanner: string;
  secondVerticalTitle: string;
  secondVerticalSubtitle: string;
  secondVerticalCta: string;
  secondVerticalCtaLink: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

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
