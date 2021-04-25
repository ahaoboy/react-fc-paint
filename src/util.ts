export const isPC = () => {
  const ua = window?.navigator?.userAgent ?? '';
  const platform = /Windows|Macintosh|Linux|Ubuntu/i;
  return platform.test(ua);
};
