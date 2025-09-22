// React Router DOM
declare module 'react-router-dom' {
  export interface NavigateFunction {
    (to: string, options?: { replace?: boolean; state?: any }): void;
    (delta: number): void;
  }
  
  export function useNavigate(): NavigateFunction;
  export function BrowserRouter(props: { children: React.ReactNode }): JSX.Element;
  export function Routes(props: { children: React.ReactNode }): JSX.Element;
  export function Route(props: { path: string; element: React.ReactNode }): JSX.Element;
  export function Navigate(props: { to: string; replace?: boolean }): JSX.Element;
  export function Link(props: { to: string; children: React.ReactNode; [key: string]: any }): JSX.Element;
}

// Lucide React
declare module 'lucide-react' {
  export interface LucideProps {
    size?: number | string;
    color?: string;
    strokeWidth?: number | string;
    className?: string;
    style?: React.CSSProperties;
  }
  
  export type LucideIcon = React.FC<LucideProps>;
  
  export const Play: LucideIcon;
  export const Film: LucideIcon;
  export const Video: LucideIcon;
  export const Camera: LucideIcon;
  export const Trophy: LucideIcon;
  export const Users: LucideIcon;
  export const Zap: LucideIcon;
  export const Star: LucideIcon;
  export const ArrowRight: LucideIcon;
  export const Sparkles: LucideIcon;
  export const Target: LucideIcon;
  export const Award: LucideIcon;
  export const Mail: LucideIcon;
  export const Lock: LucideIcon;
  export const Eye: LucideIcon;
  export const EyeOff: LucideIcon;
  export const ArrowLeft: LucideIcon;
  export const LogOut: LucideIcon;
  export const User: LucideIcon;
  export const AlertTriangle: LucideIcon;
  export const RefreshCw: LucideIcon;
}

// Class Variance Authority
declare module 'class-variance-authority' {
  export interface VariantProps<T> {
    [key: string]: any;
  }
  
  export function cva(base: string, config?: any): any;
}

// CLSX
declare module 'clsx' {
  export type ClassValue = string | number | boolean | undefined | null | { [key: string]: any } | ClassValue[];
  export default function clsx(...inputs: ClassValue[]): string;
}

// Tailwind Merge
declare module 'tailwind-merge' {
  export function twMerge(...inputs: string[]): string;
}

// Radix UI Slot
declare module '@radix-ui/react-slot' {
  export interface SlotProps extends React.HTMLAttributes<HTMLElement> {
    children?: React.ReactNode;
  }
  
  export const Slot: React.FC<SlotProps>;
}
