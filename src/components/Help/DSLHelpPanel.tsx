const rows = [
  ["tempo 120", "Define BPM (30–300)"],
  ["instrument PolySynth", "Elige el sintetizador"],
  ["C4 1/4", "Toca una nota"],
  ["[C4 E4 G4] 1/2", "Toca un acorde"],
  ["rest 1/8", "Añade silencio"],
  ["loop 4 { ... }", "Repite una secuencia"],
  ["pattern intro { ... }", "Crea una sección"],
  ["play intro", "Activa una sección o clip"],
  ["notes scale C4 major", "Genera una escala"],
  ["notes progression C4 major I V vi IV", "Genera acordes"],
  ["notes arp CM FM GM CM", "Genera arpegio"],
];

export function DSLHelpPanel() {
  return <div className="help-grid">{rows.map(([code, text]) => <div key={code}><code>{code}</code><span>{text}</span></div>)}</div>;
}
