import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function nameToSlug(name: string): string {
  return name
    .toLowerCase() // Converte para minúsculas
    .normalize("NFD") // Remove acentos
    .replace(/[\u0300-\u036f]/g, "") // Remove diacríticos
    .replace(/[^a-z0-9\s-]/g, "") // Remove caracteres especiais
    .trim() // Remove espaços extras no início e fim
    .replace(/\s+/g, "-") // Substitui espaços por hífens
    .replace(/-+/g, "-") // Remove hífens duplicados
    .replace(/^-+|-+$/g, ""); // Remove hífens do início e fim
}
