export const TWITCH_ALERT_TRIGGERS = ["never", "follow", "subscribe", "gift"];

interface TwitchAlertTrigger {
  type: string;
}

interface TwitchAlertAudio {
  delay: number;
  volume: number;
  type: "file" | "tts";
}

interface TwitchAlertAudioFile extends TwitchAlertAudio {
  type: "file";
  url: string;
}

interface TwitchAlertAudioTTS extends TwitchAlertAudio {
  type: "tts";
  template: string;
}

export interface TwitchAlertData {
  id: string;
  name: string;
  enabled: boolean;
  triggers: TwitchAlertTrigger[];
  audio: TwitchAlertAudio[];
}
