function normalizeWhitespace(value: string): string {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

const SUBCATEGORIA_ALIASES: Record<string, string> = {
  "cuidado hogar": "cuidado del hogar",
};

export function normalizeSubcategoriaName(value: string): string {
  const normalized = normalizeWhitespace(value);
  return SUBCATEGORIA_ALIASES[normalized] ?? normalized;
}

export function formatSubcategoriaLabel(value: string): string {
  const normalized = normalizeSubcategoriaName(value);

  if (normalized === "cuidado del hogar") {
    return "Cuidado del hogar";
  }

  return value;
}

export function areSameSubcategoria(a: string, b: string): boolean {
  return normalizeSubcategoriaName(a) === normalizeSubcategoriaName(b);
}

export function getSubcategoriaVariants(value: string): string[] {
  const raw = value.trim();
  const normalized = normalizeSubcategoriaName(value);

  const titleCase = normalized
    .split(" ")
    .map((word) => (word ? `${word[0].toUpperCase()}${word.slice(1)}` : word))
    .join(" ");

  if (normalized === "cuidado del hogar") {
    return [
      "Cuidado del hogar",
      "Cuidado del Hogar",
      "Cuidado hogar",
      "Cuidado Hogar",
      raw,
    ];
  }

  return Array.from(new Set([raw, normalized, titleCase]));
}

export function normalizeCategoriaName(value: string): string {
  const normalized = normalizeWhitespace(value);

  if (normalized === "hogat") {
    return "hogar";
  }

  return normalized;
}
