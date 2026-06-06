import type { Token, TokenType } from "./tokens";

export function tokenize(source: string): Token[] {
  const tokens: Token[] = [];
  let offset = 0;
  let line = 1;
  let column = 1;

  const add = (type: TokenType, value: string, startOffset = offset, startColumn = column) =>
    tokens.push({ type, value, loc: { line, column: startColumn, offset: startOffset } });

  while (offset < source.length) {
    const char = source[offset];
    if (char === "/" && source[offset + 1] === "/") {
      while (offset < source.length && source[offset] !== "\n") {
        offset++;
        column++;
      }
      continue;
    }
    if (char === "\n") {
      add("newline", "\n");
      offset++;
      line++;
      column = 1;
      continue;
    }
    if (/\s/.test(char)) {
      offset++;
      column++;
      continue;
    }
    const single: Record<string, TokenType> = {
      "{": "lbrace",
      "}": "rbrace",
      "[": "lbracket",
      "]": "rbracket",
    };
    if (single[char]) {
      add(single[char], char);
      offset++;
      column++;
      continue;
    }
    const start = offset;
    const startColumn = column;
    while (
      offset < source.length &&
      !/\s/.test(source[offset]) &&
      !["{", "}", "[", "]"].includes(source[offset]) &&
      !(source[offset] === "/" && source[offset + 1] === "/")
    ) {
      offset++;
      column++;
    }
    const value = source.slice(start, offset);
    const type: TokenType = /^\d+\/\d+$/.test(value)
      ? "duration"
      : /^\d+$/.test(value)
        ? "number"
        : "word";
    add(type, value, start, startColumn);
  }
  tokens.push({ type: "eof", value: "", loc: { line, column, offset } });
  return tokens;
}
