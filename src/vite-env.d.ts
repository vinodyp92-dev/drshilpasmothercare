/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BOOKING_SCRIPT_URL?: string;
  readonly VITE_BOOKING_SCRIPT_SECRET?: string;
  readonly VITE_CLINIC_WHATSAPP?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '*.jpg' {
  const value: string;
  export default value;
}

declare module '*.png' {
  const value: string;
  export default value;
}

declare module '*.svg' {
  const value: string;
  export default value;
}
