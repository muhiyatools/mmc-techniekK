const SUPABASE_URL = "https://givwadhkowednmwskpfc.supabase.co";

export function resolveProductImage(image: string | null | undefined): string {
  if (!image) return "/images/placeholder-product.png";

  if (image.startsWith("http") || image.startsWith("data:")) {
    return image;
  }

  if (image.startsWith("/")) {
    return image;
  }

  const storagePrefix = "product-images/";
  if (image.startsWith(storagePrefix)) {
    return `${SUPABASE_URL}/storage/v1/object/public/${image}`;
  }

  return "/images/placeholder-product.png";
}
