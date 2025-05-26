import 'expo-router/build/typed-routes/types';


declare module 'expo-router/build/typed-routes/types' {
  export type HrefObject = {
    pathname: LinkProps.href;
    params?: Record<string, string>;
  };
}