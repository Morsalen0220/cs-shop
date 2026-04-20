const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const buildApiUrl = (path: string) => {
  if (!API_URL) {
    return null;
  }

  const baseUrl = API_URL.replace(/\/$/, "");
  const apiPath = path.startsWith("/") ? path : `/${path}`;

  return `${baseUrl}${apiPath}`;
};

export const fetchJson = async <T>(path: string, fallback: T): Promise<T> => {
  const url = buildApiUrl(path);

  if (!url) {
    return fallback;
  }

  try {
    const res = await fetch(url, {
      cache: "no-store",
    });

    if (!res.ok) {
      return fallback;
    }

    return res.json();
  } catch {
    return fallback;
  }
};
