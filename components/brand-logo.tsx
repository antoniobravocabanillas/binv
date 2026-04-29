import Image from "next/image";
import { cn } from "@/lib/utils";
import { brand } from "@/lib/brand";

type BrandLogoProps = {
  variant?: "mark" | "horizontal";
  className?: string;
  priority?: boolean;
};

export function BrandLogo({ variant = "horizontal", className, priority = false }: BrandLogoProps) {
  if (variant === "mark") {
    return (
      <span className={cn("relative block overflow-hidden rounded-md bg-white", className)}>
        <Image
          src={brand.logoBadge}
          alt={`${brand.name} isotipo`}
          fill
          priority={priority}
          sizes="(max-width: 768px) 56px, 72px"
          className="object-cover"
        />
      </span>
    );
  }

  return (
    <span className={cn("relative block overflow-hidden rounded-md bg-white", className)}>
      <Image
        src={brand.logoHorizontal}
        alt={`${brand.name} logo`}
        fill
        priority={priority}
        sizes="(max-width: 768px) 180px, 260px"
        className="object-contain"
      />
    </span>
  );
}
