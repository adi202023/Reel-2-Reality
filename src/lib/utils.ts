// Simple utility function for class name merging
export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(' ');
}

// Additional utility functions
export function clsx(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(' ');
}

export function twMerge(...inputs: string[]): string {
  return inputs.join(' ');
}
