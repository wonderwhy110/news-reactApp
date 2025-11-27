const isProduction =
  window.location.hostname !== "localhost" &&
  window.location.hostname !== "127.0.0.1";

export const PUBLIC_URL = isProduction
  ? "https://wonderwhy110.github.io/news-reactApp"
  : "";
