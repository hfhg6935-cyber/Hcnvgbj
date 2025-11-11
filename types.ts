export enum Status {
    Initial = 'INITIAL',
    ApiKeyMissing = 'API_KEY_MISSING',
    Ready = 'READY',
    Loading = 'LOADING',
    Done = 'DONE',
    Error = 'ERROR',
}

export type AppStatus = Status;

export type ImageConfig = {
    prompt: string;
    aspectRatio: '16:9' | '9:16' | '1:1' | '4:3' | '3:4';
}

export type VideoConfig = {
    prompt: string;
    aspectRatio: '16:9' | '9:16';
    resolution: '720p' | '1080p';
};

// Define the aistudio interface for global window object
// Fix: Inlined the type definition for `window.aistudio` to resolve declaration conflict errors.
declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}
