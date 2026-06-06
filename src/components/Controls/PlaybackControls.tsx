interface Props {
  audioActive: boolean;
  playing: boolean;
  autoPlay: boolean;
  tempo: number;
  hasErrors: boolean;
  onActivate: () => void;
  onPlay: () => void;
  onStop: () => void;
  onRestart: () => void;
  onAutoPlay: (value: boolean) => void;
  onTempo: (value: number) => void;
  onExport: () => void;
}

export function PlaybackControls(props: Props) {
  return (
    <div className="controls">
      <button className="primary" onClick={props.onActivate}>
        <span className={`status-dot ${props.audioActive ? "active" : ""}`} />
        {props.audioActive ? "Audio activo" : "Activar audio"}
      </button>
      <button onClick={props.onPlay} disabled={!props.audioActive || props.hasErrors}>▶ Play</button>
      <button onClick={props.onStop} disabled={!props.playing}>■ Stop</button>
      <button onClick={props.onRestart} disabled={!props.audioActive || props.hasErrors}>↻ Restart</button>
      <label className="tempo-control">
        <span>{props.tempo} BPM</span>
        <input type="range" min="30" max="300" value={props.tempo} onChange={(event) => props.onTempo(Number(event.target.value))} />
      </label>
      <label className="toggle">
        <input type="checkbox" checked={props.autoPlay} onChange={(event) => props.onAutoPlay(event.target.checked)} />
        <span />
        Auto-play
      </label>
      <button onClick={props.onExport}>Exportar MIDI</button>
    </div>
  );
}
