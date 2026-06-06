const rows = [
  ["tempo 120", "Define BPM (30–300)"],
  ["instrument PolySynth", "Elige el sintetizador"],
  ["volume -12", "Ajusta el volumen del canal en dB"],
  ["C4 1/4", "Toca una nota"],
  ["[C4 E4 G4] 1/2", "Toca un acorde"],
  ["rest 1/8", "Añade silencio"],
  ["loop 4 { ... }", "Repite una secuencia"],
  ["pattern intro { ... }", "Crea una sección"],
  ["play intro", "Activa una sección o clip"],
  ["notes scale C4 major", "Genera una escala"],
  ["notes progression C4 major I V vi IV", "Genera acordes"],
  ["notes arp CM FM GM CM", "Genera arpegio"],
  ["randomNotes scale D2 minor", "Define el pool usado por R"],
  ["dur 32n", "Controla cuánto dura cada sonido"],
];

export function DSLHelpPanel() {
  return <div className="help-grid">{rows.map(([code, text]) => <div key={code}><code>{code}</code><span>{text}</span></div>)}</div>;
}
