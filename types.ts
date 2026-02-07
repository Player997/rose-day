
export interface Message {
  id: number;
  text: string;
  position: [number, number, number];
}

export interface AppState {
  isOpened: boolean;
  selectedMessage: string | null;
}
