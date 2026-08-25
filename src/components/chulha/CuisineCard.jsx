import { Link } from "@tanstack/react-router";
import { resolveImage, defaultImages } from "@/lib/image-helper";

export function CuisineCard({ name, flag, recipes, image, slug }) {
  const imgSrc = resolveImage(image, defaultImages.biryani);

  return (
    <Link
      to="/cuisines/$slug"
      params={{ slug }}
      className="hover-lift group relative block aspect-[4/5] overflow-hidden rounded-3xl bg-muted"
    >
      <img
        src={imgSrc}
        alt={`${name} food`}
        loading="lazy"
        width={1024}
        height={768}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = defaultImages.biryani;
        }}
        className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-linear-to-t from-foreground/85 via-foreground/25 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-4">
        <p className="text-2xl">{flag}</p>
        <p className="font-display text-lg font-semibold text-background">{name}</p>
        <p className="text-xs text-background/75">{recipes} recipes</p>
      </div>
    </Link>
  );
}
