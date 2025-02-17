import { clsx, type ClassValue } from "clsx"
import { parse } from "date-fns";
import { format } from 'date-fns-tz'
import { es } from "date-fns/locale";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDate = (dateStr: string): string => {
  const justDate = dateStr.split('T')[0];

  const date = parse(justDate, 'yyyy-MM-dd', new Date());

  return format(date, "eeee, d 'de' MMMM 'de' yyyy", {
    locale: es
  }).toLowerCase();
}