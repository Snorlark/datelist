/**
 * The site themes. Colours live in app/globals.css under [data-theme=…];
 * this list only names them and gives each a swatch for the picker.
 */
export const THEMES = [
  { id: "matcha", label: "Matcha", band: "#CFE3A3", mark: "#DCF26B", page: "#FBFBF9" },
  { id: "sakura", label: "Sakura", band: "#F6D3DC", mark: "#F3C6E8", page: "#FCFAFA" },
  { id: "sky", label: "Sunday sky", band: "#CFE2F3", mark: "#FFE98A", page: "#FAFBFD" },
  { id: "butter", label: "Butter", band: "#F7E3A1", mark: "#FFC9A8", page: "#FDFBF5" },
  { id: "night", label: "Night", band: "#3C4A2C", mark: "#C8E35A", page: "#161715" },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];
export const THEME_KEY = "datelist-theme";
export const isThemeId = (v: unknown): v is ThemeId => THEMES.some((t) => t.id === v);

/**
 * Runs inline in <head> before first paint so a saved theme never flashes
 * the default colours. Kept tiny and dependency-free on purpose.
 */
export const THEME_BOOT = `try{var t=localStorage.getItem("${THEME_KEY}");if(${JSON.stringify(THEMES.map((t) => t.id))}.indexOf(t)>0)document.documentElement.dataset.theme=t}catch(e){}`;
