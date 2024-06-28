export const useTheme = () => {
  const theme = ref('lofi');

  const setTheme = (newTheme) => {
    theme.value = newTheme;
  };

  watchEffect(() => {
    if (process.client) {
      document.documentElement.setAttribute('data-theme', theme.value);
    }
  });

  return { theme, setTheme };
};
