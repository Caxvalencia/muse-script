import type { CompiledSong } from "../../music/types";

export function CompiledPreview({ song }: { song: CompiledSong }) {
  return (
    <div className="channel-list">
      {song.channels.map((channel) => (
        <div className="channel-card" key={channel.name}>
          <div><b>{channel.name}</b><span>{channel.instrument}</span></div>
          {channel.clips.map((clip) => (
            <div className="clip-row" key={clip.name}>
              <span className={clip.play ? "clip-playing" : ""}>{clip.play ? "▶" : "○"}</span>
              <b>{clip.name}</b>
              <code>{clip.pattern}</code>
              <small>{clip.subdiv}</small>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
