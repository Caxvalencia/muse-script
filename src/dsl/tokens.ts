import type { SourceLocation } from "./ast";

export type TokenType =
  | "word"
  | "number"
  | "duration"
  | "lbrace"
  | "rbrace"
  | "lbracket"
  | "rbracket"
  | "newline"
  | "eof";

export interface Token {
  type: TokenType;
  value: string;
  loc: SourceLocation;
}
