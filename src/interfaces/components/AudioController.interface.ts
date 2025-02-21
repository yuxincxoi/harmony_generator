export interface AudioControllerProps {
  audioURL: string | null;
  onPlayingChange: (isPlaying: boolean) => void;
}
