const API_PATH = "/api";

const ensureApiPath = (url: string): string => {
  const trimmedUrl = url.replace(/\/+$/, "");

  return /\/api(\/|$)/.test(trimmedUrl)
    ? trimmedUrl
    : `${trimmedUrl}${API_PATH}`;
};

const resolveBaseEntrypoint = (): string | undefined => {
  if (typeof window === "undefined") {
    return process.env.NEXT_PUBLIC_API_ENTRYPOINT;
  }

  return process.env.NEXT_PUBLIC_API_ENTRYPOINT ?? window.location.origin;
};

export const resolveEntrypoint = (): string => {
  const rawEntrypoint = resolveBaseEntrypoint();

  return rawEntrypoint ? ensureApiPath(rawEntrypoint) : `${API_PATH}`;
};

export const ENTRYPOINT = resolveEntrypoint();
