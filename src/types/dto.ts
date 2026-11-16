
/* =========================
   Status Change
========================= */

export interface StatChangeDto {
  id: string;
  stat: boolean;
}

/* =========================
   ID
========================= */

export interface IdListDto {
  id: string;
}

/* =========================
   Name List
========================= */

export interface NameList {
  id: string;
  name: string;
}

/* =========================
   Name + Amharic Name
========================= */

export interface NameAmList {
  id: string;
  name: string;
  nameAm: string;
}

export interface CatNameList {
  name: string;
  icon:string;
}


/* =========================
   File View
========================= */

export interface FileViewDto {
  data: string;
  contentType: string;
  fileName: string;
}
