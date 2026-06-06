import type { CSSProperties } from "react";
import { AudioWaveform } from "lucide-react";
import type { CompiledClip, CompiledSong } from "../../music/types";

interface Props {
  song: CompiledSong;
  playing: boolean;
  tempo: number;
}

const TRACK_COLORS = ["violet", "cyan", "green", "pink"];

export function SongTimeline({ song, playing, tempo }: Props) {
  const tracks = song.channels.flatMap((channel) =>
    channel.clips.filter((clip) => clip.play).map((clip) => ({ channel, clip })),
  );
  const totalSteps = Math.max(16, ...tracks.map(({ clip }) => clipLength(clip)));
  const visibleSteps = Math.min(totalSteps, 32);
  const loopSeconds = Math.max(2, visibleSteps * (60 / tempo) / 4);
  const timelineStyle = {
    "--timeline-steps": visibleSteps,
    "--loop-duration": `${loopSeconds}s`,
  } as CSSProperties;

  return (
    <section className={`song-timeline ${playing ? "is-playing" : ""}`} style={timelineStyle}>
      <header className="timeline-heading">
        <div>
          <span className="timeline-live"><i />{playing ? "Reproduciendo" : "Timeline"}</span>
          <strong>{visibleSteps} pasos</strong>
        </div>
        <div className="timeline-bars" aria-hidden="true">
          {Array.from({ length: 13 }, (_, index) => <i key={index} style={{ height: `${6 + ((index * 7) % 16)}px` }} />)}
        </div>
      </header>
      <div className="timeline-body">
        <div className="timeline-labels">
          {tracks.map(({ channel, clip }, index) => (
            <div className="timeline-label" key={`${channel.name}-${clip.name}`}>
              <span className={`track-icon ${TRACK_COLORS[index % TRACK_COLORS.length]}`}><AudioWaveform aria-hidden="true" /></span>
              <span><b>{clip.name}</b><small>{channel.name} · {channel.instrument} · {channel.volume} dB</small></span>
            </div>
          ))}
        </div>
        <div className="timeline-grid">
          <div className="timeline-ruler">
            {Array.from({ length: Math.ceil(visibleSteps / 4) }, (_, index) => <span key={index}>{index + 1}</span>)}
          </div>
          <div className="timeline-playhead" aria-hidden="true" />
          {tracks.map(({ channel, clip }, trackIndex) => (
            <div className="timeline-track" key={`${channel.name}-${clip.name}`}>
              {clipBlocks(clip, visibleSteps).map((block, index) => (
                <i
                  className={TRACK_COLORS[trackIndex % TRACK_COLORS.length]}
                  key={`${block.start}-${index}`}
                  style={{
                    "--block-start": block.start,
                    "--block-length": block.length,
                    "--block-pitch": block.pitch,
                  } as CSSProperties}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      {!tracks.length && <div className="timeline-empty">No hay clips activos para visualizar.</div>}
    </section>
  );
}

function clipLength(clip: CompiledClip) {
  if (clip.events?.length) return Math.max(...clip.events.map((event) => event.startStep + 1));
  return flattenPattern(clip.pattern).length;
}

function clipBlocks(clip: CompiledClip, limit: number) {
  if (clip.events?.length) {
    return clip.events
      .filter((event) => event.type !== "rest" && event.startStep < limit)
      .map((event, index) => ({
        start: event.startStep,
        length: Math.max(1, Math.min(durationWidth(event.duration), limit - event.startStep)),
        pitch: pitchPosition(event.notes[0] ?? String(index)),
      }));
  }

  let noteIndex = 0;
  return flattenPattern(clip.pattern).flatMap((symbol, start) => {
    if (!["x", "X", "R"].includes(symbol) || start >= limit) return [];
    const note = clip.notes[noteIndex++ % Math.max(clip.notes.length, 1)];
    return [{ start, length: 1, pitch: pitchPosition(Array.isArray(note) ? note[0] : note ?? String(start)) }];
  });
}

function flattenPattern(pattern: string) {
  return pattern.replace(/[\[\]]/g, "").split("");
}

function durationWidth(duration: string) {
  const [numerator, denominator] = duration.split("/").map(Number);
  if (!numerator || !denominator) return 1;
  return Math.max(1, Math.round((numerator / denominator) * 16));
}

function pitchPosition(note: string) {
  return [...note].reduce((sum, character) => sum + character.charCodeAt(0), 0) % 4;
}
