/**
 * Inline, render-blocking script that applies the saved theme before first
 * paint (prevents a flash of the wrong theme). If the user has not chosen a
 * theme, no attribute is set and CSS `prefers-color-scheme` decides.
 */
export function ThemeScript() {
  const code = `(function(){try{var t=localStorage.getItem('aveyra-theme');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t);}}catch(e){}})();`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
