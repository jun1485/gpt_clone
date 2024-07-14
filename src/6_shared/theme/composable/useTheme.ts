import { ref } from "vue";

export const useThemeStore = () => {
  const isDarkMode = ref(false);

  // 다크모드 토글
  const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value;
    if (isDarkMode.value) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  };

  // 초기 상태에 따라 다크모드 설정
  const getThemeKey = () => {
    let themeKey;
    if (!themeKey) {
      themeKey = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return themeKey;
  };

  return {
    isDarkMode,
    toggleDarkMode,
    getThemeKey,
  };
};
