import { PERMISSIONS } from 'react-native-permissions';

export type ColorScheme = 'dark' | 'light' | 'blue';
export type ThemeMode = 'light' | 'dark';

export type AppThemeType = Record<
  ColorScheme,
  {
    dark: boolean;
    colors: {
      primary: string;
      background: string;
      card: string;
      text: string;
      border: string;
      notification: string;
    };
  }
>;

export type PermissionType =
  | typeof PERMISSIONS.ANDROID[keyof typeof PERMISSIONS.ANDROID]
  | typeof PERMISSIONS.IOS[keyof typeof PERMISSIONS.IOS]
  | typeof PERMISSIONS.WINDOWS[keyof typeof PERMISSIONS.WINDOWS];
