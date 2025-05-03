export type APIOmittedParams<T> = Omit<T, "id" | "createdAt" | "updatedAt">;
