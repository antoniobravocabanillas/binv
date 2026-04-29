import type { Metadata } from "next";
import { brand } from "@/lib/brand";
import { absoluteUrl } from "@/lib/utils";

type SeoInput = {
  title: string;
  description: string;
  path?: string;
};

export function createMetadata({ title, description, path = "" }: SeoInput): Metadata {
  const fullTitle = `${title} | ${brand.shortName}`;
  const url = absoluteUrl(path);

  return {
    title: fullTitle,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: brand.name,
      locale: "es_PE",
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description
    }
  };
}
