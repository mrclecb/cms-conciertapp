import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const patchDate = (date: string) => {
  const originalDate = new Date(date);
  return new Date(originalDate.setDate(originalDate.getDate() - 1));
}