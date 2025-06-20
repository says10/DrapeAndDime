import {
  LayoutDashboard,
  Shapes,
  ShoppingBag,
  Tag,
  UsersRound,
  Video,
  TestTube,
} from "lucide-react";

export const navLinks = [
  {
    url: "/",
    icon: <LayoutDashboard />,
    label: "Dashboard",
  },
  {
    url: "/collections",
    icon: <Shapes />,
    label: "Collections",
  },
  {
    url: "/products",
    icon: <Tag />,
    label: "Products",
  },
  {
    url: "/banners",
    icon: <Video />,
    label: "Banners",
  },
  {
    url: "/test",
    icon: <TestTube />,
    label: "Test",
  },
  {
    url: "/orders",
    icon: <ShoppingBag />,
    label: "Orders",
  },
  {
    url: "/customers",
    icon: <UsersRound />,
    label: "Customers",
  },
  {
    url: "/coupons",
    icon: <Tag />,
    label: "Coupons",
  },
];
