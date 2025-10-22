"use client";

export default function ThemePicker() {
  const themes = ["default", "wildwest", "wrestler", "clean"];
  function swapTheme(theme: string) {
    themes.map((themeName) =>
      document.body.classList.remove(`theme-${themeName}`)
    );
    document.body.classList.add(`theme-${theme}`);
  }
  return (
    <div className="text-xs">
      Theme:
      <span>
        {themes.map((themeName, index) => (
          <button
            key={index}
            className="inline-block ml-2 hover:text-accent"
            onClick={() => swapTheme(themeName)}
            aria-hidden="true"
          >
            {index + 1}
          </button>
        ))}
      </span>
    </div>
  );
}
