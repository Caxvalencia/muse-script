import MidiWriter from "midi-writer-js";
import type { CompiledSong } from "./types";

export function exportMidi(song: CompiledSong) {
  const tracks = song.channels.map((channel) => {
    const track = new MidiWriter.Track();
    track.setTempo(song.tempo);
    channel.clips.filter((clip) => clip.play).forEach((clip) => {
      clip.events?.forEach((event) => {
        if (event.type !== "rest" && event.notes.every((note) => !note.startsWith("@"))) {
          track.addEvent(new MidiWriter.NoteEvent({ pitch: event.notes, duration: event.duration.replace("n", "") }));
        } else if (event.type === "rest") {
          track.addEvent(new MidiWriter.NoteEvent({ pitch: ["C0"], duration: event.duration.replace("n", ""), velocity: 0 }));
        }
      });
    });
    return track;
  });
  const uri = new MidiWriter.Writer(tracks).dataUri();
  const link = document.createElement("a");
  link.href = uri;
  link.download = "musescript.mid";
  link.click();
}
