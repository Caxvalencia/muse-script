import { useEffect, useMemo, useState } from "react";
import { BookOpen, Braces, CircleAlert, Copy, ListMusic, RotateCcw, Waves } from "lucide-react";
import logoUrl from "../assets/logo-mark.png";
import { PlaybackControls } from "../components/Controls/PlaybackControls";
import { DiagnosticsPanel } from "../components/Diagnostics/DiagnosticsPanel";
import { MusicCodeEditor } from "../components/Editor/MusicCodeEditor";
import { DSLHelpPanel } from "../components/Help/DSLHelpPanel";
import { CompiledPreview } from "../components/Preview/CompiledPreview";
import { examples } from "../examples/examples";
import { useDSLCompiler } from "../hooks/useDSLCompiler";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { usePlayback } from "../hooks/usePlayback";
import { exportMidi } from "../music/exportMidi";
import "./App.css";

type Tab = "diagnostics" | "compiled" | "ast" | "help";

const tabDetails = {
  compiled: { icon: ListMusic, label: "Song" },
  diagnostics: { icon: CircleAlert, label: "Issues" },
  ast: { icon: Braces, label: "AST" },
  help: { icon: BookOpen, label: "Help" },
} satisfies Record<Tab, { icon: typeof ListMusic; label: string }>;

export default function App() {
  const [source, setSource] = useLocalStorage("musescript-source", examples[0].code);
  const [selectedExample, setSelectedExample] = useState(() => {
    const match = examples.findIndex((example) => example.code === source);
    return match >= 0 ? match : 0;
  });
  const [tab, setTab] = useState<Tab>("compiled");
  const [autoPlay, setAutoPlay] = useState(true);
  const [runtimeTempo, setRuntimeTempo] = useState(110);
  const result = useDSLCompiler(source);
  const hasErrors = result.diagnostics.some((item) => item.severity === "error");
  const playback = usePlayback(result.song, hasErrors, autoPlay);
  const activeClips = useMemo(() => result.song.channels.flatMap((channel) => channel.clips).filter((clip) => clip.play).length, [result.song]);

  const selectExample = (index: number) => {
    setSelectedExample(index);
    setSource(examples[index].code);
  };

  useEffect(() => setRuntimeTempo(result.song.tempo), [result.song.tempo]);

  const changeTempo = (tempo: number) => {
    setRuntimeTempo(tempo);
    playback.setTempo(tempo);
  };

  return (
    <div className="app-shell">
      <div className="ambient-orb orb-one" />
      <div className="ambient-orb orb-two" />
      <div className="ambient-orb orb-three" />

      <header className="topbar glass-surface">
        <div className="brand"><span className="logo"><img src={logoUrl} alt="" /></span><div><h1>MuseScript</h1><p>Live coding music playground</p></div></div>
        <div className="header-stats">
          <span className="stat-pill"><i className={playback.audioActive ? "live" : ""} />{playback.audioActive ? "Audio ready" : "Audio locked"}</span>
          <span className="stat-pill"><small>Tempo</small><b>{runtimeTempo}</b> BPM</span>
          <span className="stat-pill"><small>Live</small><b>{activeClips}</b> clips</span>
        </div>
      </header>

      <main>
        <section className="editor-panel panel glass-surface">
          <div className="panel-heading">
            <div className="panel-title"><span className="panel-icon"><Waves aria-hidden="true" /></span><div><span className="eyebrow">SOURCE</span><h2>Composition</h2></div></div>
            <div className="editor-actions">
              <div className="example-picker">
                <select value={selectedExample} onChange={(event) => selectExample(Number(event.target.value))}>
                  {examples.map((example, index) => <option value={index} key={example.name}>{example.name}</option>)}
                </select>
                <small>{examples[selectedExample].description}</small>
              </div>
              <button onClick={() => void navigator.clipboard.writeText(source)}><Copy aria-hidden="true" />Copiar</button>
              <button onClick={() => setSource(examples[selectedExample].code)}><RotateCcw aria-hidden="true" />Reset</button>
            </div>
          </div>
          <div className="editor-wrap"><MusicCodeEditor value={source} onChange={setSource} /></div>
          <div className="editor-footer">
            <div className="editor-metrics"><span>{source.split("\n").length} líneas</span><span>{source.length} caracteres</span><span>Compilación 500 ms</span></div>
            <div className="syntax-legend" aria-label="Leyenda de sintaxis">
              <span className="legend-command">comando</span>
              <span className="legend-note">nota</span>
              <span className="legend-duration">duración</span>
              <span className="legend-pattern">pattern</span>
              <span className="legend-theory">teoría</span>
            </div>
          </div>
        </section>

        <aside className="right-workspace">
          <PlaybackControls
            {...playback}
            autoPlay={autoPlay}
            tempo={runtimeTempo}
            hasErrors={hasErrors}
            onActivate={() => void playback.activateAudio()}
            onPlay={() => void playback.play()}
            onStop={playback.stop}
            onRestart={() => void playback.restart()}
            onAutoPlay={setAutoPlay}
            onTempo={changeTempo}
            onExport={() => exportMidi(result.song)}
          />
          {playback.audioError && <div className="audio-error">{playback.audioError}</div>}
          <section className="output-panel panel glass-surface">
            <nav>
              {(["compiled", "diagnostics", "ast", "help"] as Tab[]).map((item) => (
                <button className={tab === item ? "selected" : ""} onClick={() => setTab(item)} key={item}>
                  {(() => {
                    const Icon = tabDetails[item].icon;
                    const count = item === "diagnostics" && result.diagnostics.length ? ` ${result.diagnostics.length}` : "";
                    return <><Icon aria-hidden="true" />{tabDetails[item].label}{count}</>;
                  })()}
                </button>
              ))}
            </nav>
            <div className="output-content">
              {tab === "compiled" && <CompiledPreview song={result.song} playing={playback.playing} tempo={runtimeTempo} />}
              {tab === "diagnostics" && <DiagnosticsPanel diagnostics={result.diagnostics} />}
              {tab === "ast" && <pre>{JSON.stringify(result.ast, null, 2)}</pre>}
              {tab === "help" && <DSLHelpPanel />}
            </div>
            <div className={`compile-status ${hasErrors ? "failed" : ""}`}>
              <span>{hasErrors ? "Compilación detenida" : "Compilación correcta"}</span>
              <span>{result.song.channels.length} canales · {activeClips} clips activos</span>
            </div>
          </section>
        </aside>
      </main>
    </div>
  );
}
