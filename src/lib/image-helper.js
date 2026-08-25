import biryani from "@/assets/recipe-biryani.jpg";
import pizza from "@/assets/recipe-pizza.jpg";
import pasta from "@/assets/recipe-pasta.jpg";
import pancakes from "@/assets/recipe-pancakes.jpg";
import friedRice from "@/assets/recipe-friedrice.jpg";
import sushi from "@/assets/recipe-sushi.jpg";
import tacos from "@/assets/recipe-tacos.jpg";
import heroTable from "@/assets/hero-table.jpg";

export const defaultImages = {
  biryani,
  pizza,
  pasta,
  pancakes,
  friedRice,
  sushi,
  tacos,
  heroTable,
};

const map = {
  "recipe-biryani.jpg": biryani,
  "recipe-pizza.jpg": pizza,
  "recipe-pasta.jpg": pasta,
  "recipe-pancakes.jpg": pancakes,
  "recipe-friedrice.jpg": friedRice,
  "recipe-sushi.jpg": sushi,
  "recipe-tacos.jpg": tacos,
  "hero-table.jpg": heroTable,
};

export function resolveImage(imgSrc, fallback = biryani) {
  if (!imgSrc) return fallback;

  // If it's already an imported module/URL or base64
  if (typeof imgSrc === "object" && imgSrc.src) return imgSrc.src;
  if (typeof imgSrc !== "string") return imgSrc;

  if (imgSrc.startsWith("data:") || imgSrc.startsWith("blob:") || imgSrc.startsWith("http://") || imgSrc.startsWith("https://")) {
    return imgSrc;
  }

  // Check matching filename
  for (const [key, value] of Object.entries(map)) {
    if (imgSrc.includes(key)) {
      return value;
    }
  }

  // If it's a backend /uploads/... path
  if (imgSrc.startsWith("/uploads/")) {
    return imgSrc;
  }

  return imgSrc || fallback;
}
