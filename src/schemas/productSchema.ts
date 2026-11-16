import { z } from "zod";

// Step 1 — Product core
export const productStep1Schema = z.object({
  name: z.string().min(2, "Name is required"),
  categoryId: z.string().min(1, "Category is required"),
  isPerishable: z.boolean(),
  isActive: z.boolean(),
  // Detail fields (inline on step 1)
  shortDesc: z.string().min(5, "Short description is required"),
  desc: z.string().optional(),
  brand: z.string().min(1, "Brand is required"),
  originCountry: z.string().min(1, "Origin country is required"),
  ingredients: z.string().optional(),
  storageInst: z.string().optional(),
});

// Step 2 — Attributes (list, managed inline)
export const attributeSchema = z.object({
  name: z.string().min(1, "Attribute name is required"),
});

// Step 3 — Images (file list, validated separately)

// Step 4 — Variant (no attribute linking here)
export const variantSchema = z.object({
  name: z.string().min(1, "Variant name is required"),
  price: z.number().positive("Price must be positive"),
  quantity: z.number().min(0, "Quantity must be 0 or more"),
  reportQuantity: z.number().min(0, "Report quantity must be 0 or more"),
  batchNumber: z.string().optional(),
  manufactureDate: z.string().optional(),
  expireDate: z.string().optional(),
  isDefault: z.boolean(),
  packagingTypeId: z.string().min(1, "Packaging type is required"),
  measTypeId: z.string().min(1, "Measurement type is required"),
});

// Variant attribute link — value per attribute
export const variantAttributeSchema = z.object({
  attributeId: z.string().min(1),
  value: z.string().min(1, "Value is required"),
});

export type ProductStep1Values = z.infer<typeof productStep1Schema>;
export type AttributeValues = z.infer<typeof attributeSchema>;
export type VariantValues = z.infer<typeof variantSchema>;
export type VariantAttributeValue = z.infer<typeof variantAttributeSchema>;
