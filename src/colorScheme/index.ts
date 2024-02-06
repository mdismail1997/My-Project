import type { AppThemeType } from '../models';

export const appTheme: AppThemeType = {
  dark: {
    dark: true,
    colors: {
      primary: 'rgb(10, 132, 255)',
      background: 'rgb(1, 1, 1)',
      card: 'rgb(18, 18, 18)',
      text: 'rgb(229, 229, 231)',
      border: 'rgb(39, 39, 41)',
      notification: 'rgb(255, 69, 58)',
    },
  },
  light: {
    dark: false,
    colors: {
      primary: 'rgb(0, 122, 255)',
      background: 'rgb(242, 242, 242)',
      card: 'rgb(255, 255, 255)',
      text: 'rgb(28, 28, 30)',
      border: 'rgb(216, 216, 216)',
      notification: 'rgb(255, 59, 48)',
    },
  },
  blue: {
    dark: true,
    colors: {
      background: 'rgba(0, 11, 35, 1)',
      primary: 'rgb(10, 132, 255)',
      card: 'rgba(9, 0, 48, 1)',
      text: 'rgb(229, 229, 231)',
      border: 'rgba(24, 19, 45, 1)',
      notification: 'rgb(255, 69, 58)',
    },
  },
};
