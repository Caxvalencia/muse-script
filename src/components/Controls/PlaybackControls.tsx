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
    <div className="controls glass-surface">
      <div className="control-group transport-group">
        <button className="primary audio-button" onClick={props.onActivate}>
          <span className={`status-dot ${props.audioActive ? "active" : ""}`} />
          {props.audioActive ? "Audio activo" : "Activar audio"}
        </button>
        <button className="icon-button play-button" title="Play" onClick={props.onPlay} disabled={!props.audioActive || props.hasErrors}><span>▶</span><small>Play</small></button>
        <button className="icon-button" title="Stop" onClick={props.onStop} disabled={!props.playing}><span>■</span><small>Stop</small></button>
        <button className="icon-button" title="Restart" onClick={props.onRestart} disabled={!props.audioActive || props.hasErrors}><span>↻</span><small>Restart</small></button>
      </div>
      <div className="control-divider" />
      <div className="control-group settings-group">
        <label className="tempo-control">
          <span><small>TEMPO</small><b>{props.tempo}</b> BPM</span>
          <input type="range" min="30" max="300" value={props.tempo} onChange={(event) => props.onTempo(Number(event.target.value))} />
        </label>
        <label className="toggle">
          <input type="checkbox" checked={props.autoPlay} onChange={(event) => props.onAutoPlay(event.target.checked)} />
          <span />
          <b>Auto-play</b>
        </label>
        <button className="export-button" onClick={props.onExport}><span>⇩</span> Exportar MIDI</button>
      </div>
    </div>
  );
}
