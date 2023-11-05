import clsx, { type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * This Function will combine the passed parameters, dynamically add and merge
 * the same parameters to one single string that can be used.
 *
 * Docs: https://ui.shadcn.com/docs/installation/manual#add-a-cn-helper
 *
 * @param inputs Values that will be combined in this function
 * @returns A String that you can apply to a HTMLElement to style it using Tailwind
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
