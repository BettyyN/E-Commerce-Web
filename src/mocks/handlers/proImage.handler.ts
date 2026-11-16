import { http, HttpResponse } from "msw";
import { ok, problem, notFound } from "../data/db";
import {
  dataUriResponse,
  fileToDataUri,
  formatBytes,
} from "../data/file.utils";
import { products, images, type MockImage } from "../data/product.db";

const BASE = "*/item/v1/ProImage";

const MAX_BYTES = 5 * 1024 * 1024;

const toListItem = (i: MockImage) => ({
  id: i.id,
  dateAdd: i.dateAdd,
  dateMod: i.dateMod,
  isDeleted: i.isDeleted,
  fileName: i.fileName,
  contentType: i.contentType,
  size: formatBytes(i.size),
  url: `/item/v1/ProImage/GetImage/${i.id}`,
  isMainStr: i.isMain ? "Yes" : "No",
});

const findActive = (id: string) =>
  images.find((i) => i.id === id && !i.isDeleted);

const setMain = (image: MockImage) => {
  images
    .filter((i) => i.productId === image.productId)
    .forEach((i) => (i.isMain = i.id === image.id));
};

export const proImageHandlers = [
  // id = product id
  http.get(`${BASE}/AllList/:id`, ({ params }) => {
    if (!products.some((p) => p.id === params.id && !p.isDeleted))
      return notFound("Product");

    const rows = images
      .filter((i) => i.productId === params.id && !i.isDeleted)
      .sort((a, b) => Number(b.isMain) - Number(a.isMain))
      .map(toListItem);

    return rows.length > 0 ? ok(rows) : new HttpResponse(null, { status: 204 });
  }),

  // id = image id
  http.get(`${BASE}/GetImage/:id`, async ({ params }) => {
    const image = findActive(String(params.id));
    return image ? dataUriResponse(image.dataUri) : notFound("Image");
  }),

  http.post(`${BASE}/ChangeMain/:id`, ({ params }) => {
    const image = findActive(String(params.id));
    if (!image) return notFound("Image");

    setMain(image);
    return ok(null, 201);
  }),

  // id = product id. Multipart: productId, isMain, image (file)
  http.post(`${BASE}/Add/:id`, async ({ request, params }) => {
    const productId = String(params.id);
    if (!products.some((p) => p.id === productId && !p.isDeleted)) {
      return problem(400, "Upload failed", "The product was not found.");
    }

    const form = await request.formData();
    const file = form.get("image");
    const isMain = String(form.get("isMain")) === "true";

    if (!(file instanceof File) || file.size === 0) {
      return problem(400, "Upload failed", "An image file is required.");
    }
    if (!file.type.startsWith("image/")) {
      return problem(400, "Upload failed", "Only image files are allowed.");
    }
    if (file.size > MAX_BYTES) {
      return problem(
        400,
        "Upload failed",
        "The image must be 5 MB or smaller.",
      );
    }

    const isFirst = !images.some(
      (i) => i.productId === productId && !i.isDeleted,
    );

    const image: MockImage = {
      id: crypto.randomUUID(),
      dateAdd: new Date().toISOString(),
      dateMod: null,
      isDeleted: false,
      productId,
      fileName: file.name,
      contentType: file.type,
      size: file.size,
      dataUri: await fileToDataUri(file),
      isMain: false,
    };

    images.push(image);
    if (isMain || isFirst) setMain(image); // a product's first image is always the main one

    return ok(null, 201);
  }),

  http.delete(`${BASE}/Del/:id`, ({ params }) => {
    const image = findActive(String(params.id));
    if (!image) return notFound("Image");

    image.isDeleted = true;

    // keep a main image while the product still has any
    if (image.isMain) {
      image.isMain = false;
      const next = images.find(
        (i) => i.productId === image.productId && !i.isDeleted,
      );
      if (next) setMain(next);
    }

    return ok();
  }),
];
