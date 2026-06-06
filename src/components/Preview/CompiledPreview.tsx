import { Circle, Play } from "lucide-react";
import type { CompiledSong } from "../../music/types";
import { SongTimeline } from "./SongTimeline";

export function CompiledPreview({ song, playing, tempo }: { song: CompiledSong; playing: boolean; tempo: number }) {
  return (
    <div className="song-preview">
      <SongTimeline song={song} playing={playing} tempo={tempo} />
      <div className="channel-list">
        {song.channels.map((channel) => (
          <div className="channel-card" key={channel.name}>
            <div className="channel-header"><div><span className="channel-light" /><b>{channel.name}</b></div><span>{channel.instrument} · {channel.volume} dB</span></div>
            {channel.clips.map((clip) => (
              <div className="clip-row" key={clip.name}>
                <span className={clip.play ? "clip-playing" : ""}>{clip.play ? <Play aria-hidden="true" /> : <Circle aria-hidden="true" />}</span>
                <b>{clip.name}</b>
                <code>{clip.pattern}</code>
                <small title={clip.dur ? `Paso ${clip.subdiv}, sonido ${clip.dur}` : `Paso y sonido ${clip.subdiv}`}>{clip.dur ? `${clip.subdiv}/${clip.dur}` : clip.subdiv}</small>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
