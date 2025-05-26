import 'expo-router/build/typed-routes/types';


declare module 'expo-router/build/typed-routes/types' {
  export type HrefObject = {
    /** The path of the route. */
    pathname: any;
    /** Optional parameters for the route. */
    params?: UnknownInputParams;
};
} 