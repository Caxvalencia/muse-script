import { useCallback, useEffect, useRef, useState } from "react";
import type { CompiledSong } from "../music/types";
import { PlaybackController } from "../playback/PlaybackController";

export function usePlayback(song: CompiledSong, hasErrors: boolean, autoPlay: boolean) {
  const controller = useRef<PlaybackController | null>(null);
  const [audioActive, setAudioActive] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [audioError, setAudioError] = useState("");
  if (!controller.current) controller.current = new PlaybackController();

  const activateAudio = useCallback(async () => {
    try {
      await controller.current!.activate();
      setAudioActive(true);
      setAudioError("");
    } catch (error) {
      setAudioError(error instanceof Error ? error.message : "No se pudo activar el audio.");
    }
  }, []);

  const play = useCallback(async () => {
    if (!audioActive || hasErrors) return;
    try {
      await controller.current!.load(song);
      await controller.current!.play();
      setPlaying(true);
      setAudioError("");
    } catch (error) {
      setAudioError(error instanceof Error ? error.message : "No se pudo reproducir.");
    }
  }, [audioActive, hasErrors, song]);

  const stop = useCallback(() => {
    controller.current!.stop();
    setPlaying(false);
  }, []);

  const restart = useCallback(async () => {
    if (!audioActive || hasErrors) return;
    await controller.current!.load(song);
    await controller.current!.restart();
    setPlaying(true);
  }, [audioActive, hasErrors, song]);

  const setTempo = useCallback((bpm: number) => controller.current!.setTempo(bpm), []);

  useEffect(() => {
    if (hasErrors) stop();
    else if (audioActive && autoPlay) void play();
  }, [audioActive, autoPlay, hasErrors, play, stop, song]);

  useEffect(() => () => controller.current?.dispose(), []);
  return { audioActive, playing, audioError, activateAudio, play, stop, restart, setTempo };
}
