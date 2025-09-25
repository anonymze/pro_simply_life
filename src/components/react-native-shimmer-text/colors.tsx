import config from "tailwind.config";
import { ShimmerColors } from "./types";

export const defaultShimmerColors: {
  light: ShimmerColors;
  dark: ShimmerColors;
} = {
  light: {
    text: config.theme.extend.colors.primary,
    shimmer: {
      start: config.theme.extend.colors.primary,
      middle: "red",
      end: "blue",
    },
  },
  dark: {
    text: config.theme.extend.colors.primary,
    shimmer: {
      start: "gray",
      middle: "#ffffff",
      end: "gray",
    },
  },
};
