export type DiagnosticSeverity = "error" | "warning" | "info";

export interface Diagnostic {
  severity: DiagnosticSeverity;
  message: string;
  line: number;
  column: number;
  code: string;
}

export const diagnostic = (
  code: string,
  message: string,
  line: number,
  column: number,
  severity: DiagnosticSeverity = "error",
): Diagnostic => ({ code, message, line, column, severity });
