import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines and merges class names using clsx and tailwind-merge
 * This utility is part of the Cult UI pattern
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
} 