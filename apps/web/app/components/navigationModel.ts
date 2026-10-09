export function platformCategory(path: string) {
  if (path.startsWith("/mleague")) return "mleague";
  if (/^\/(trainer|training)(\/|$)/.test(path)) return "training";
  if (/^\/(learn|rules|videos)(\/|$)/.test(path)) return "learning";
  return "analysis";
}
export function isFocusWorkspace(path: string) {
  return /^\/(trainer|training)\/.+/.test(path) && !path.endsWith("/help")
    || /^\/analysis\/.+/.test(path) && !path.endsWith("/help")
    || path === "/tools";
}
