// Fix React module exports
declare module 'react' {
  import * as React from 'react';

  // Core React types
  export interface Component<P = {}, S = {}, SS = any> extends React.Component<P, S, SS> {}
  export interface ComponentClass<P = {}, S = React.ComponentState> extends React.ComponentClass<P, S> {}
  export interface FunctionComponent<P = {}> extends React.FunctionComponent<P> {}
  export interface FC<P = {}> extends React.FC<P> {}

  // React hooks
  export const useState: typeof React.useState;
  export const useEffect: typeof React.useEffect;
  export const useContext: typeof React.useContext;
  export const createContext: typeof React.createContext;
  export const forwardRef: typeof React.forwardRef;
  export const createElement: typeof React.createElement;

  // React components
  export const Component: typeof React.Component;
  export const StrictMode: typeof React.StrictMode;

  // React types
  export type ReactNode = React.ReactNode;
  export type ReactElement = React.ReactElement;
  export type CSSProperties = React.CSSProperties;
  export type HTMLAttributes<T> = React.HTMLAttributes<T>;
  export type ButtonHTMLAttributes<T> = React.ButtonHTMLAttributes<T>;
  export type ChangeEvent<T> = React.ChangeEvent<T>;
  export type FormEvent<T> = React.FormEvent<T>;
  export type MouseEvent<T> = React.MouseEvent<T>;

  // Default export
  export default React;
}

// Ensure React is available globally
declare global {
  const React: typeof import('react');

  namespace JSX {
    interface IntrinsicElements {
      // Simplified JSX elements - catch all HTML elements
      [elemName: string]: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}
