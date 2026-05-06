(function () {
  const themeKey = "apworld.theme.v2";
  const theme = localStorage.getItem(themeKey) === "dark" ? "dark" : "light";
  const color = theme === "dark" ? "#050505" : "#f5f5f7";
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", color);
})();
