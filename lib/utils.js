// lib/utils.jsx
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Utility to merge classNames
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

