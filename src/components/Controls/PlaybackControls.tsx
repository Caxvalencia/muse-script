import { Download, Play, RotateCcw, Square, Volume2 } from "lucide-react";

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
          <Volume2 aria-hidden="true" />
          {props.audioActive ? "Audio activo" : "Activar audio"}
        </button>
        <button className="icon-button play-button" title="Play" onClick={props.onPlay} disabled={!props.audioActive || props.hasErrors}><Play aria-hidden="true" /><small>Play</small></button>
        <button className="icon-button" title="Stop" onClick={props.onStop} disabled={!props.playing}><Square aria-hidden="true" /><small>Stop</small></button>
        <button className="icon-button" title="Restart" onClick={props.onRestart} disabled={!props.audioActive || props.hasErrors}><RotateCcw aria-hidden="true" /><small>Restart</small></button>
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
        <button className="export-button" onClick={props.onExport}><Download aria-hidden="true" />Exportar MIDI</button>
      </div>
    </div>
  );
}
