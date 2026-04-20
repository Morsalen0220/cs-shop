import { Billboard, Category, Color, Product, Size } from "@/types";

export const billboards: Billboard[] = [
  {
    id: "nike-running",
    label: "Run the day",
    imageUrl: "/images/nike-just-do-it.jpg",
  },
  {
    id: "nike-lifestyle",
    label: "Built for every move",
    imageUrl: "/images/image-1.jpg",
  },
];

export const categories: Category[] = [
  {
    id: "running",
    name: "Running",
    billboard: billboards[0],
  },
  {
    id: "lifestyle",
    name: "Lifestyle",
    billboard: billboards[1],
  },
  {
    id: "basketball",
    name: "Basketball",
    billboard: billboards[0],
  },
];

export const sizes: Size[] = [
  { id: "size-8", name: "US 8", value: "8" },
  { id: "size-9", name: "US 9", value: "9" },
  { id: "size-10", name: "US 10", value: "10" },
];

export const colors: Color[] = [
  { id: "black", name: "Black", value: "#111111" },
  { id: "red", name: "Red", value: "#dc2626" },
  { id: "green", name: "Green", value: "#16a34a" },
];

export const products: Product[] = [
  {
    id: "nike-reactx",
    category: categories[0],
    description: "Soft cushioning and a light feel for everyday running.",
    isArchived: false,
    isFeatured: true,
    name: "Nike ReactX Infinity Run",
    price: "165000",
    size: sizes[1],
    color: colors[0],
    images: [{ id: "reactx-1", url: "/images/nike-reactx.png" }],
  },
  {
    id: "air-force-one",
    category: categories[1],
    description: "Classic street style with a clean leather finish.",
    isArchived: false,
    isFeatured: true,
    name: "Nike Air Force 1",
    price: "120000",
    size: sizes[2],
    color: colors[1],
    images: [{ id: "af1-1", url: "/images/image-1.jpg" }],
  },
  {
    id: "zoom-freak",
    category: categories[2],
    description: "Responsive support for quick cuts and fast breaks.",
    isArchived: false,
    isFeatured: true,
    name: "Nike Zoom Freak",
    price: "140000",
    size: sizes[0],
    color: colors[2],
    images: [{ id: "zoom-1", url: "/images/image-2.jpg" }],
  },
];
