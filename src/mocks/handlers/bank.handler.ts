import { http, HttpResponse } from "msw";
import type { StatChangeDto } from "@/types/dto";
import { ok, problem, notFound } from "../data/db";

const BASE = "*/item/v1/Bank";


interface MockBank {
  id: string;
  dateAdd: string;
  dateMod: string | null;
  isDeleted: boolean;
  name: string;
  acctNum: string;
  acctHolder: string;
  isActive: boolean;
  icon: string; // data URI
}

export const banks: MockBank[] = [
  {
    id: "b-100",
    dateAdd: "2026-01-05T09:00:00.000Z",
    dateMod: null,
    isDeleted: false,
    name: "Commercial Bank of Ethiopia",
    acctNum: "1000123456789",
    acctHolder: "STOCK UP PLC",
    isActive: true,
    icon: "/bank/logo cbe.png",
  },
  {
    id: "b-101",
    dateAdd: "2026-02-11T10:30:00.000Z",
    dateMod: null,
    isDeleted: false,
    name: "Awash Bank",
    acctNum: "0134567890123",
    acctHolder: "STOCK UP PLC",
    isActive: true,
    icon: "/bank/Awash-bank-logo.svg",
  },
  {
    id: "b-102",
    dateAdd: "2026-03-20T14:00:00.000Z",
    dateMod: null,
    isDeleted: false,
    name: "Dashen Bank",
    acctNum: "2045678901234",
    acctHolder: "STOCK UP PLC",
    isActive: false,
    icon: "/bank/Dashen-Bank-Logo-Addis-Ababa-Ethiopia.png",
  },
];

const toStatus = (b: MockBank) => (b.isActive ? "Active" : "Inactive");

const toListItem = (b: MockBank) => ({ ...b, status: toStatus(b) });

const fileToDataUri = async (file: File) => {
  const bytes = new Uint8Array(await file.arrayBuffer());
  let binary = "";
  bytes.forEach((byte) => (binary += String.fromCharCode(byte)));
  return `data:${file.type || "image/png"};base64,${btoa(binary)}`;
};

// Reads the icon file from the form, whichever key the frontend used
const getIconFile = (form: FormData): File | null => {
  const value = form.get("icon.content") ?? form.get("icon");
  return value instanceof File && value.size > 0 ? value : null;
};

export const bankHandlers = [
  http.get(`${BASE}/AllList`, () =>
    ok(banks.filter((b) => !b.isDeleted).map(toListItem)),
  ),

  http.get(`${BASE}/Detail/:id`, ({ params }) => {
    const bank = banks.find((b) => b.id === params.id && !b.isDeleted);
    return bank ? ok(toListItem(bank)) : notFound("Bank");
  }),

  // Returns the actual image bytes
  http.get(`${BASE}/Icon/:id`, async ({ params }) => {
    const bank = banks.find((b) => b.id === params.id && !b.isDeleted);
    if (!bank) return notFound("Bank");

    const blob = await (await fetch(bank.icon)).blob();
    return new HttpResponse(blob, {
      headers: { "Content-Type": blob.type || "image/png" },
    });
  }),

  http.post(`${BASE}/ChangeStat`, async ({ request }) => {
    const { id, stat } = (await request.json()) as StatChangeDto;
    const bank = banks.find((b) => b.id === id && !b.isDeleted);
    if (!bank) return notFound("Bank");

    bank.isActive = stat;
    bank.dateMod = new Date().toISOString();
    return ok();
  }),

  http.post(`${BASE}/Add`, async ({ request }) => {
    const form = await request.formData();
    const name = String(form.get("name") ?? "").trim();
    const acctNum = String(form.get("acctNum") ?? "").trim();
    const acctHolder = String(form.get("acctHolder") ?? "").trim();
    const file = getIconFile(form);

    if (!name || !acctNum || !acctHolder) {
      return problem(
        400,
        "Add failed",
        "Name, account number and account holder are required.",
      );
    }
    if (!file) {
      return problem(400, "Add failed", "A bank icon is required.");
    }
    if (banks.some((b) => b.acctNum === acctNum && !b.isDeleted)) {
      return problem(
        400,
        "Add failed",
        "A bank account with this number already exists.",
      );
    }

    banks.push({
      id: crypto.randomUUID(),
      dateAdd: new Date().toISOString(),
      dateMod: null,
      isDeleted: false,
      name,
      acctNum,
      acctHolder,
      isActive: true,
      icon: await fileToDataUri(file),
    });

    return ok(null, 201);
  }),

  http.put(`${BASE}/Mod/:id`, async ({ request, params }) => {
    const bank = banks.find((b) => b.id === params.id && !b.isDeleted);
    if (!bank) return notFound("Bank");

    const form = await request.formData();
    const file = getIconFile(form);

    bank.name = String(form.get("name") ?? bank.name);
    bank.acctNum = String(form.get("acctNum") ?? bank.acctNum);
    bank.acctHolder = String(form.get("acctHolder") ?? bank.acctHolder);
    if (file) bank.icon = await fileToDataUri(file); // icon is optional on modify
    bank.dateMod = new Date().toISOString();

    return ok();
  }),

  http.delete(`${BASE}/Del/:id`, ({ params }) => {
    const bank = banks.find((b) => b.id === params.id && !b.isDeleted);
    if (!bank) return notFound("Bank");

    bank.isDeleted = true; // soft delete, matching isDeleted on BankMapDto
    return ok();
  }),
];
