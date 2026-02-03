const AI_PATTERNS: RegExp[] = [
  /\bartificial intelligence\b/i,
  /\bai\b/i,
  /\ba\.i\.\b/i,
  /\bmachine learning\b/i,
  /\bdeep learning\b/i,
  /\bgenerative ai\b/i,
  /\bgenai\b/i,
  /\bllm(s)?\b/i,
  /\blarge language model(s)?\b/i,
  /\btransformer(s)?\b/i,
  /\bneural network(s)?\b/i,
  /\bcomputer vision\b/i,
  /\bchatgpt\b/i,
  /\bgpt-?\d+(?:\.\d+)?\b/i,
  /\bgpt\b/i,
  /\bclaude\b/i,
  /\bgemini\b/i,
  /\bllama\b/i,
  /\bmistral\b/i,
  /\bopenai\b/i,
  /\bdeepmind\b/i,
  /\banthropic\b/i
];

const AFRICA_PATTERNS: RegExp[] = [
  /\bafrica\b/i,
  /\bafrican\b/i,
  /\bafrican union\b/i,
  /\bafcfta\b/i,
  /\bsub-saharan\b/i,
  /\bnorth africa\b/i,
  /\bwest africa\b/i,
  /\beast africa\b/i,
  /\bsouthern africa\b/i,
  /\bcentral africa\b/i,
  /\bmaghreb\b/i,
  /\bnigeria\b/i,
  /\bghana\b/i,
  /\bkenya\b/i,
  /\bethiopia\b/i,
  /\buganda\b/i,
  /\btanzania\b/i,
  /\brwanda\b/i,
  /\bsenegal\b/i,
  /\bivory coast\b/i,
  /\bcote d'?ivoire\b/i,
  /\bcameroon\b/i,
  /\bmalawi\b/i,
  /\bnamibia\b/i,
  /\bbotswana\b/i,
  /\bmozambique\b/i,
  /\bmadagascar\b/i,
  /\bmauritius\b/i,
  /\bseychelles\b/i,
  /\bzimbabwe\b/i,
  /\bzambia\b/i,
  /\bguinea\b/i,
  /\bguinea-bissau\b/i,
  /\bgambia\b/i,
  /\bsierra leone\b/i,
  /\bliberia\b/i,
  /\bbenin\b/i,
  /\btogo\b/i,
  /\bniger\b/i,
  /\bchad\b/i,
  /\bmauritania\b/i,
  /\bsouth africa\b/i,
  /\bmorocco\b/i,
  /\balgeria\b/i,
  /\btunisia\b/i,
  /\blibya\b/i,
  /\begypt\b/i,
  /\bsudan\b/i,
  /\bsouth sudan\b/i,
  /\bcongo\b/i,
  /\bdr congo\b/i,
  /\bdrc\b/i,
  /\bcongo-kinshasa\b/i,
  /\bcongo-brazzaville\b/i,
  /\bangola\b/i,
  /\bburkina faso\b/i,
  /\bmali\b/i,
  /\bconakry\b/i,
  /\bcasablanca\b/i,
  /\baddis ababa\b/i,
  /\blagos\b/i,
  /\babuja\b/i,
  /\bnairobi\b/i,
  /\baccra\b/i,
  /\bjohannesburg\b/i,
  /\bcape town\b/i,
  /\bpretoria\b/i,
  /\bdakar\b/i,
  /\bkampala\b/i,
  /\bkinshasa\b/i,
  /\byaounde\b/i,
  /\btunis\b/i,
  /\btripoli\b/i,
  /\bcairo\b/i,
  /\bkhartoum\b/i
];

export function isAiRelated(text: string): boolean {
  if (!text) {
    return false;
  }

  return AI_PATTERNS.some((pattern) => pattern.test(text));
}

export function isAfricaRelated(text: string): boolean {
  if (!text) {
    return false;
  }

  return AFRICA_PATTERNS.some((pattern) => pattern.test(text));
}

export function buildAiText(input: Array<string | null | undefined>): string {
  return input.filter(Boolean).join(" ");
}
