/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GRAPHQL_ENDPOINT: string;
  readonly VITE_GRAPHQL_WS_ENDPOINT: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_STUDIO_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
