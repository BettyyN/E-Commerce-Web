import { http, HttpResponse } from "msw";
import { ok, notFound } from "../data/db";
import { money } from "../data/file.utils";
import {
  products,
  variants,
  images,
  activeDiscount,
  discountedPrice,
} from "../data/product.db";
import { categories } from "./cat.handler";
import { packTypes } from "./pack.handler";

const BASE = "*/item/v1/ProView";

const catName = (id: string) => categories.find((c) => c.id === id)?.name ?? "";

const packName = (id: string) => packTypes.find((p) => p.id === id)?.name ?? "";

const mainImage = (productId: string) =>
  images.find((i) => i.productId === productId && !i.isDeleted && i.isMain) ??
  images.find((i) => i.productId === productId && !i.isDeleted);

const toListItem = (p: (typeof products)[number]) => {
  // One card per active, in-stock variant
  return variants
    .filter((v) => v.productId === p.id && !v.isDeleted && v.isActive)
    .map((v) => {
      const discount = activeDiscount(v.id);
      const img = mainImage(p.id);

      return {
        id: p.id,
        variantId: v.id,
        category: catName(p.categoryId),
        url: img ? `/item/v1/ProView/ProImage/${img.id}` : null,
        hasDiscount: !!discount,
        discDis: discount
          ? discount.type === "Percentage"
            ? `${discount.value}% OFF`
            : `${money(discount.value)} ETB OFF`
          : null,
        product: p.name,
        variant: v.name,
        price: money(discountedPrice(v, discount)),
        pack: packName(v.packagingTypeId),
      };
    });
};

export const proViewHandlers = [
  http.get(`${BASE}/All`, () => {
    const rows = products
      .filter((p) => !p.isDeleted && p.isActive)
      .flatMap(toListItem);

    return rows.length > 0 ? ok(rows) : new HttpResponse(null, { status: 204 });
  }),

  http.get(`${BASE}/Detail/:id`, ({ params }) => {
    const product = products.find(
      (p) => p.id === params.id && !p.isDeleted && p.isActive,
    );
    if (!product) return notFound("Product");

    const productImages = images
      .filter((i) => i.productId === product.id && !i.isDeleted)
      .sort((a, b) => Number(b.isMain) - Number(a.isMain))
      .map((i) => ({
        id: i.id,
        url: `/item/v1/ProView/ProImage/${i.id}`,
        isMain: i.isMain,
      }));

    const productVariants = variants
      .filter((v) => v.productId === product.id && !v.isDeleted && v.isActive)
      .map((v, idx) => {
        const discount = activeDiscount(v.id);
        const finalPrice = discountedPrice(v, discount);
        const originalPrice = v.totalPrice;
        const discountStr = discount
          ? discount.type === "Percentage"
            ? `${discount.value}% OFF`
            : `${money(discount.value)} ETB OFF`
          : "";
        return {
          id: v.id,
          name: v.name,
          newPrice: money(finalPrice),
          oldPrice: discount ? money(originalPrice) : "0 ETB",
          discDis: discountStr,
          hasDiscount: !!discount,
          isDefault: v.isDefault ?? idx === 0,
          pack: packName(v.packagingTypeId),
          quantity: v.quantity,
        };
      });

    return ok({
      productId: product.id,
      product: product.name,
      desc: product.desc,
      shortDesc: product.shortDesc,
      brand: product.brand,
      originCountry: product.originCountry,
      ingredients: product.ingredients,
      storageInst: product.storageInst,
      images: productImages,
      variants: productVariants,
    });
  }),

  // id = image id; serves the raw bytes like ProImage/GetImage does
  http.get(`${BASE}/ProImage/:id`, async ({ params }) => {
    const image = images.find((i) => i.id === params.id && !i.isDeleted);
    if (!image) return notFound("Image");

    const blob = await (await fetch(image.dataUri)).blob();
    return new HttpResponse(blob, {
      headers: { "Content-Type": blob.type || "image/png" },
    });
  }),
];
