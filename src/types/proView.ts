/* =========================
   ProView List (storefront)
   GET /api/item/v1/ProView/All
========================= */

export interface ProViewListDto {
  id: string; // product uuid
  variantId: string;
  category: string | null;
  url: string | null; // product image URL
  hasDiscount: boolean;
  discDis: string | null; // e.g. "10% OFF"
  product: string | null;
  variant: string | null;
  price: string | null; // formatted amount e.g. "1,200 ETB"
  pack: string | null; // packaging type name
}

/* =========================
   ProView Detail
   GET /api/item/v1/ProView/Detail/{id}
========================= */

export interface ProImageList {
  isMain: boolean;
  url: string;
}

export interface ProVariantList {
  id: string;
  name: string | null;
  newPrice: string | null; // discounted price e.g. "595 ETB"
  oldPrice: string | null; // original price e.g. "700 ETB"
  discDis: string | null; // e.g. "15% OFF" or ""
  hasDiscount: boolean;
  isDefault: boolean;
  pack: string | null; 
}

export interface ProViewDetailDto {
  productId: string;
  product: string | null;
  desc: string | null;
  shortDesc: string | null;
  brand: string | null;
  originCountry: string | null;
  ingredients: string | null;
  storageInst: string | null;
  images: ProImageList[] | null;
  variants: ProVariantList[] | null;
}
