import { StyleSheet } from 'react-native';
import {
  defaultSystemFonts,
  MixedStyleDeclaration,
} from 'react-native-render-html';

export const globalStyle = StyleSheet.create({
  headingStyle: {
    fontSize: 17,
    fontWeight: '600',
  },
  customFont: {
    // fontFamily: 'Playball-Regular',
  },
});

export const baseStyles: MixedStyleDeclaration = {
  fontFamily: 'Poppins-Regular',
};

export const systemFonts: string[] = ['Poppins-Regular', ...defaultSystemFonts];

export const tagsStyles = (
  textColor: string
): Record<string, MixedStyleDeclaration> => ({
  body: {
    whiteSpace: 'normal',
    color: textColor,
  },
  p: {
    padding: 0,
    margin: 0,
  },
  a: {
    color: 'green',
  },
});
