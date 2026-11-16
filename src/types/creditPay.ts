export interface CrdtPayAddDto {
  payMethod: string;
  amount: number;
  creditId: string;
  bankId: string;
  receipt: File;
}

export interface CrdtPayAddReq {
  payMethod: string;
  amount: number;
  creditId: string;
  bankId: string;
  receipt: ReceiptUpload;
}

export interface ReceiptUpload {
  contentType: string;
  length: number;
  content: File;
}
