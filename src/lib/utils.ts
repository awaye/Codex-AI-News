export function parseTags(input: string | null | undefined): string[] {
  if (!input) {
    return [];
  }

  return Array.from(
    new Set(
      input
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    )
  );
}

export function formatTags(tags: string[]): string {
  return tags.join(", ");
}

export function normalizeText(input: string | null | undefined): string {
  if (!input) {
    return "";
  }
  return input.replace(/\s+/g, " ").trim();
}

export function stripHtml(input: string | null | undefined): string {
  if (!input) {
    return "";
  }
  return input.replace(/<[^>]*>/g, " ");
}

export function truncateText(input: string, maxLength = 320): string {
  if (input.length <= maxLength) {
    return input;
  }

  const trimmed = input.slice(0, maxLength).replace(/\s+\S*$/, "");
  return `${trimmed}…`;
}
