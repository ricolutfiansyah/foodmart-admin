import type { ApiAxiosError } from "@/types/api";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRupiah(price: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export const getErrorMessage = (error: ApiAxiosError): string => {
  if (!error.response) return 'Koneksi terputus';

  switch (error.response.status) {
    case 401: return 'Sesi habis, silakan login ulang';
    case 403: return 'Anda tidak memiliki akses';
    case 404: return 'Data tidak ditemukan';
    case 409: return 'Data sudah ada';
    case 500: return 'Server sedang bermasalah';
    case 503: return 'Server maintenance';
    default: return error.response.data?.message || 'Terjadi kesalahan';
  }
};