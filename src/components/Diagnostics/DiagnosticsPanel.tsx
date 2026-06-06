import { CircleCheck } from "lucide-react";
import type { Diagnostic } from "../../dsl/diagnostics";

export function DiagnosticsPanel({ diagnostics }: { diagnostics: Diagnostic[] }) {
  if (!diagnostics.length) return <div className="empty-state ok"><CircleCheck aria-hidden="true" /><span>Sin errores. Lista para sonar.</span></div>;
  return (
    <div className="diagnostics">
      {diagnostics.map((item, index) => (
        <div className={`diagnostic ${item.severity}`} key={`${item.code}-${item.line}-${index}`}>
          <b>{item.code}</b>
          <span>L{item.line}:{item.column}</span>
          <p>{item.message}</p>
        </div>
      ))}
    </div>
  );
}
