import { useColorScheme } from 'react-native';
import { getThemeColors } from '../utils/colors';

export const useAppTheme = () => {
  const isDark = useColorScheme() === 'dark';
  return {
    isDark,
    colors: getThemeColors(isDark),
  };
};
