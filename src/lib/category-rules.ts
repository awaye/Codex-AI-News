const CATEGORY_RULES = [
  {
    value: "AI_EDUCATION",
    label: "AI education",
    patterns: [
      /\beducation\b/i,
      /\bcurriculum\b/i,
      /\bschool(s)?\b/i,
      /\buniversity\b/i,
      /\btraining\b/i,
      /\bcourse(s)?\b/i,
      /\blearning\b/i
    ]
  },
  {
    value: "HACKATHON",
    label: "Hackathon",
    patterns: [
      /\bhackathon\b/i,
      /\bchallenge\b/i,
      /\baccelerator\b/i,
      /\bbootcamp\b/i,
      /\bcompetition\b/i
    ]
  },
  {
    value: "NATIONAL",
    label: "National",
    patterns: [
      /\bgovernment\b/i,
      /\bministry\b/i,
      /\bpolicy\b/i,
      /\bregulation\b/i,
      /\bnational strategy\b/i
    ]
  },
  {
    value: "HEALTH",
    label: "Health",
    patterns: [
      /\bhealth\b/i,
      /\bmedical\b/i,
      /\bhospital\b/i,
      /\bhealthcare\b/i,
      /\bdiagnosis\b/i
    ]
  },
  {
    value: "AGRICULTURE",
    label: "Agriculture",
    patterns: [
      /\bagriculture\b/i,
      /\bfarming\b/i,
      /\bagritech\b/i,
      /\bcrop(s)?\b/i,
      /\blivestock\b/i
    ]
  },
  {
    value: "OPPORTUNITIES",
    label: "Opportunities",
    patterns: [
      /\bgrant(s)?\b/i,
      /\bfunding\b/i,
      /\bfellowship(s)?\b/i,
      /\bjobs?\b/i,
      /\bhiring\b/i,
      /\bscholarship(s)?\b/i
    ]
  }
] as const;

export type CategoryValue = (typeof CATEGORY_RULES)[number]["value"];

export const CATEGORY_OPTIONS = CATEGORY_RULES.map(({ value, label }) => ({ value, label }));

export const CATEGORY_VALUES = CATEGORY_RULES.map(({ value }) => value);

export const CATEGORY_LABELS = CATEGORY_RULES.reduce<Record<CategoryValue, string>>((acc, rule) => {
  acc[rule.value] = rule.label;
  return acc;
}, {} as Record<CategoryValue, string>);

export function classifyCategories(text: string): CategoryValue[] {
  if (!text) {
    return [];
  }
  const matches = CATEGORY_RULES.filter((rule) => rule.patterns.some((pattern) => pattern.test(text))).map(
    (rule) => rule.value
  );
  return Array.from(new Set(matches));
}

export function formatCategoryLabel(value: string) {
  return CATEGORY_LABELS[value as CategoryValue] ?? value;
}

export function parseCategories(input: string | null | undefined): CategoryValue[] {
  if (!input) {
    return [];
  }
  const rawValues = input
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  return parseCategoriesList(rawValues);
}

export function parseCategoriesList(input: unknown): CategoryValue[] {
  const values = Array.isArray(input)
    ? input.map((value) => value?.toString() ?? "")
    : typeof input === "string"
      ? input.split(",")
      : [];
  const normalized = values.map((value) => value.trim()).filter(Boolean);
  return Array.from(new Set(normalized.filter((value) => CATEGORY_VALUES.includes(value as CategoryValue)))) as CategoryValue[];
}
