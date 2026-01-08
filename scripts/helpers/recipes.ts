import type { Recipe } from "schema-dts";

export function normalize<T>(value: T | readonly T[]): readonly T[] {
  return Array.isArray(value) ? value : [value] as readonly T[];
}

export function getImageUrl(
  image: unknown
): string | undefined {
  if (typeof image === "string") return image;
  if (typeof image === "object" && image !== null) {
    const obj = image as Record<string, unknown>;
    const url = obj.contentUrl ?? obj.url;
    return typeof url === "string" ? url : undefined;
  }
  return undefined;
}

export function getRecipeImageUrl(recipe: Recipe): string | undefined {
  const imageValue = recipe.image;
  if (!imageValue) return;

  const images = normalize(imageValue);

  for (const image of images) {
    const url = getImageUrl(image);
    if (url) return url;
  }
}