
export function ThemeScript() {
  const code = `(function(){try{var t=localStorage.getItem('aveyra-theme');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t);}}catch(e){}})();`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
