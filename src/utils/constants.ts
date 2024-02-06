import { ColorScheme } from '../models';

export const THEME_PERSISTENCE_KEY = '@equipro-color-mode';
export const EQUIPRO_SELECTED_LANGUAGE = '@equipro-selected-language';
export const EQUIPRO_USER_TOKEN = '@equipro-user-token';
export const EQUIPRO_LAST_PLAYED_AUDIO_ID = '@equipro-last-played-audio-id';
export const EQUIPRO_FCM_TOKEN = '@equipro-fcm-token';
export const DUMMY_IMAGE_URL =
  'https://images.unsplash.com/photo-1590688304507-c7617bb49159?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjB8fGhvcnNlJTIwcmlkaW5nfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60';
export const Topic = 'general';

export const colorMap: Record<ColorScheme, string> = {
  light: '#fff',
  dark: '#000',
  blue: '#000872',
};

export const trainingColorScheme: Record<any, any> = {
  '1O': '#fe5558',
  '1A': '#ffce31',
  '1B': '#8ba8a4',
  1: '#a8d837',
  2: '#0078ce',
  3: '#35c4fe',
  4: '#fe5558',
  5: '#586875',
  6: '#FF5733',
  7: '#0078ce',
  8: '#a8d837',
};
