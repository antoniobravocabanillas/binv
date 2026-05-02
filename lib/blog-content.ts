type BlogContentBlock = {
  text?: unknown;
  type?: unknown;
};

type BlogContent = {
  body?: unknown;
  blocks?: unknown;
};

function normalizeWhitespace(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

export function truncateText(text: string, maxLength = 180) {
  const cleanText = normalizeWhitespace(text);
  if (cleanText.length <= maxLength) return cleanText;

  const truncated = cleanText.slice(0, maxLength).replace(/\s+\S*$/, "");
  return `${truncated || cleanText.slice(0, maxLength)}...`;
}

export function getBlogContentText(content: unknown) {
  if (!content) return "";
  if (typeof content === "string") return content;
  if (typeof content !== "object") return "";

  const parsedContent = content as BlogContent;
  if (typeof parsedContent.body === "string") return parsedContent.body;
  if (!Array.isArray(parsedContent.blocks)) return "";

  return parsedContent.blocks
    .map((block) => {
      const parsedBlock = block as BlogContentBlock;
      return typeof parsedBlock.text === "string" ? parsedBlock.text : "";
    })
    .filter(Boolean)
    .join("\n\n");
}

export function createBlogPreview(excerpt: string | null | undefined, content: unknown, maxLength = 180) {
  return truncateText(excerpt || getBlogContentText(content), maxLength);
}

export function getBlogArticleParagraphs(excerpt: string | null | undefined, content: unknown) {
  const contentText = getBlogContentText(content).trim();
  const excerptText = (excerpt || "").trim();
  const sourceText = contentText.length >= Math.min(excerptText.length * 0.65, 420) ? contentText : excerptText;

  return sourceText
    .split(/\n{2,}|\r?\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}
