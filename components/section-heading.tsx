import { Badge } from "@/components/ui/badge";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  tone?: "default" | "dark";
};

export function SectionHeading({ eyebrow, title, description, tone = "default" }: SectionHeadingProps) {
  const isDark = tone === "dark";

  return (
    <div className="max-w-3xl">
      {eyebrow ? <Badge variant="outline" className={isDark ? "mb-4 border-white/18 bg-white/8 text-white" : "mb-4"}>{eyebrow}</Badge> : null}
      <h2 className={isDark ? "font-display text-3xl font-bold tracking-normal text-white md:text-4xl" : "font-display text-3xl font-bold tracking-normal text-foreground md:text-4xl"}>{title}</h2>
      {description ? <p className={isDark ? "mt-4 text-base leading-7 text-white/66" : "mt-4 text-base leading-7 text-muted-foreground"}>{description}</p> : null}
    </div>
  );
}
