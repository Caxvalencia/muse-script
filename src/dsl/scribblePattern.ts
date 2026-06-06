const VALID_PATTERN = /^[x\-_\[\]R]+$/;

export function validateScribblePattern(value: string): string | null {
  if (!value || !VALID_PATTERN.test(value)) return "El pattern contiene caracteres inválidos.";
  let depth = 0;
  for (const char of value) {
    if (char === "[") depth++;
    if (char === "]") depth--;
    if (depth < 0) return "El pattern tiene corchetes desbalanceados.";
  }
  return depth === 0 ? null : "El pattern tiene corchetes desbalanceados.";
}
