
export enum Status {
    Initial = 'INITIAL',
    ApiKeyMissing = 'API_KEY_MISSING',
    Ready = 'READY',
    Loading = 'LOADING',
    Done = 'DONE',
    Error = 'ERROR',
}

export type AppStatus = Status;

export type VideoConfig = {
    prompt: string;
    aspectRatio: '16:9' | '9:16';
    resolution: '720p' | '1080p';
}

// Fix: Moved the AIStudio interface into the `declare global` block to ensure it correctly augments the global scope and avoids type conflicts.
// This resolves the error on the 'aistudio' property declaration in the Window interface.
declare global {
  // Define the interface for the aistudio object
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  // Extend the global Window interface
  interface Window {
    aistudio: AIStudio;
  }
}
