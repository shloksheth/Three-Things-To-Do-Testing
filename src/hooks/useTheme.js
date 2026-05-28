import { useEffect } from 'react';
import { useStore } from '../store/useStore';

export const useTheme = () => {
  const theme = useStore((state) => state.user.theme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return theme;
};
