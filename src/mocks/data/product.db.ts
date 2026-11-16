export const VAT_RATE = 0.15;

const round = (n: number) => Math.round(n * 100) / 100;

/* ---------- types ---------- */

export interface MockProduct {
  id: string;
  dateAdd: string;
  dateMod: string | null;
  isDeleted: boolean;
  name: string;
  isPerishable: boolean;
  categoryId: string;
  desc: string;
  shortDesc: string;
  brand: string;
  originCountry: string;
  ingredients: string;
  storageInst: string;
  isActive: boolean;
}

export interface MockVariant {
  id: string;
  dateAdd: string;
  dateMod: string | null;
  isDeleted: boolean;
  productId: string;
  sortOrder: number;
  itemPkg: string;
  name: string;
  batchNumber: string;
  quantity: number;
  totalPrice: number; // VAT included
  measTypeId: string;
  packagingTypeId: string;
  manufactureDate: string | null;
  expireDate: string | null;
  isDefault: boolean;
  isActive: boolean;
}

export interface MockDiscount {
  id: string;
  dateAdd: string;
  dateMod: string | null;
  isDeleted: boolean;
  variantId: string;
  type: "Percentage" | "Fixed";
  value: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface MockImage {
  id: string;
  dateAdd: string;
  dateMod: string | null;
  isDeleted: boolean;
  productId: string;
  fileName: string;
  contentType: string;
  size: number;
  dataUri: string;
  isMain: boolean;
}

/* ---------- pricing helpers ---------- */

export const splitPrice = (totalPrice: number) => {
  const price = round(totalPrice / (1 + VAT_RATE));
  return { price, vat: round(totalPrice - price), total: totalPrice };
};

export const discountedPrice = (
  variant: MockVariant,
  discount?: MockDiscount,
) => {
  if (!discount) return variant.totalPrice;

  return round(
    discount.type === "Percentage"
      ? variant.totalPrice * (1 - discount.value / 100)
      : Math.max(variant.totalPrice - discount.value, 0),
  );
};

export const activeDiscount = (variantId: string, at = new Date()) =>
  discounts.find(
    (d) =>
      d.variantId === variantId &&
      d.isActive &&
      !d.isDeleted &&
      new Date(d.startDate) <= at &&
      at <= new Date(d.endDate),
  );

// Price a customer pays right now (discount applied)
export const currentPrice = (variantId: string): number | null => {
  const variant = variants.find((v) => v.id === variantId && !v.isDeleted);
  return variant ? discountedPrice(variant, activeDiscount(variantId)) : null;
};

/* ---------- seed data ---------- */

const at = "2026-01-05T09:00:00.000Z";

const seedProduct = (
  id: string,
  name: string,
  categoryId: string,
  brand: string,
  originCountry: string,
  isPerishable = false,
): MockProduct => ({
  id,
  dateAdd: at,
  dateMod: null,
  isDeleted: false,
  name,
  isPerishable,
  categoryId,
  desc: `${name} from ${brand}. Quality checked before dispatch.`,
  shortDesc: `${brand} ${name}`,
  brand,
  originCountry,
  ingredients: isPerishable ? "100% roasted Arabica coffee beans" : "",
  storageInst: isPerishable ? "Store in a cool, dry place." : "Keep dry.",
  isActive: true,
});

export const products: MockProduct[] = [
  seedProduct("p-100", "Wireless Earbuds Pro", "cat-100", "Soundly", "China"),
  seedProduct("p-101", "Electric Blender", "cat-101", "HomeChef", "Turkey"),
  seedProduct("p-102", "Cotton T-Shirt", "cat-102", "Habesha Wear", "Ethiopia"),
  seedProduct(
    "p-103",
    "Ground Coffee",
    "cat-101",
    "Yirgacheffe Co.",
    "Ethiopia",
    true,
  ),
];

const seedVariant = (
  id: string,
  productId: string,
  name: string,
  totalPrice: number,
  quantity: number,
  measTypeId: string,
  packagingTypeId: string,
  isDefault: boolean,
  expireDate: string | null = null,
  sortOrder = 1,
  itemPkg = "1 PCS",
): MockVariant => ({
  id,
  dateAdd: at,
  dateMod: null,
  isDeleted: false,
  productId,
  sortOrder,
  itemPkg,
  name,
  batchNumber: `B-${id.toUpperCase()}`,
  quantity,
  totalPrice,
  measTypeId,
  packagingTypeId,
  manufactureDate: expireDate ? "2026-08-01T00:00:00.000Z" : null,
  expireDate,
  isDefault,
  isActive: true,
});

export const variants: MockVariant[] = [
  seedVariant("v-100", "p-100", "Black", 2300, 40, "mt-101", "pk-100", true),
  seedVariant(
    "v-101",
    "p-100",
    "White",
    2300,
    25,
    "mt-101",
    "pk-100",
    false,
    null,
    2,
  ),
  seedVariant(
    "v-102",
    "p-101",
    "1.5L Standard",
    4600,
    15,
    "mt-101",
    "pk-102",
    true,
  ),
  seedVariant("v-103", "p-102", "Size M", 690, 100, "mt-101", "pk-101", true),
  seedVariant(
    "v-104",
    "p-102",
    "Size L",
    690,
    80,
    "mt-101",
    "pk-101",
    false,
    null,
    2,
  ),
  seedVariant(
    "v-105",
    "p-103",
    "1kg Bag",
    1150,
    60,
    "mt-100",
    "pk-101",
    true,
    "2027-03-01T00:00:00.000Z",
    1,
    "1 KG",
  ),
];

export const discounts: MockDiscount[] = [
  {
    id: "d-100",
    dateAdd: at,
    dateMod: null,
    isDeleted: false,
    variantId: "v-102",
    type: "Percentage",
    value: 10,
    startDate: "2026-09-01T00:00:00.000Z",
    endDate: "2026-12-31T23:59:59.000Z",
    isActive: true,
  },
];

const seedImage = (
  id: string,
  productId: string,
  fileName: string,
  isMain: boolean,
): MockImage => ({
  id,
  dateAdd: at,
  dateMod: null,
  isDeleted: false,
  productId,
  fileName,
  contentType: fileName.endsWith(".webp") ? "image/webp" : "image/png",
  size: 1200,
  dataUri: `/${fileName}`,
  isMain,
});

export const images: MockImage[] = [
  seedImage("img-100", "p-100", "doc_2025-12-08_12-50-01.webp", true),

  seedImage("img-101", "p-100", "photo_2025-12-07_10-43-52.jpg", false),

  seedImage("img-102", "p-101", "doc_2025-12-08_13-04-47.webp", true),

  seedImage("img-103", "p-102", "14-600x600.jpg", true),

  seedImage(
    "img-104",
    "p-103",
    "ACV_Liquid_16oz_Transparent_Front_a6de13bb_4cfc_471c_be7d_060e5b9948a3.png",
    true,
  ),

  seedImage("img-105", "p-104", "71slAAUyxDL._SL1500_.jpg", true),

  seedImage("img-106", "p-105", "5-1-600x800-removebg-preview.png", true),

  seedImage("img-107", "p-106", "14-600x600-removebg-preview.png", true),

  seedImage("img-108", "p-107", "BD4rYo15QcJxpng-optimized.jpg", true),
];
