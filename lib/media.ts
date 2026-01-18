export const normalizeMediaUrl = (url: string) => {
  if (!url) return url;
  try {
    return encodeURI(decodeURI(url));
  } catch {
    return encodeURI(url);
  }
};
