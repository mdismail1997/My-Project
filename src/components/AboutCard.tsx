import React from 'react';
import { Box, Image, Pressable, Stack, Text, View } from 'native-base';
// import { useNavigation } from '@react-navigation/native';
import { globalStyle } from '../utils/globalStyles';
import {
  ColorSchemeType,
  ResponsiveValue,
} from 'native-base/lib/typescript/components/types';
import { ILinearGradientProps } from 'native-base/lib/typescript/components/primitives/Box/types';

interface AboutCardProps {
  imageURL: string;
  title: string;
  description: string;
  bgColor?: ResponsiveValue<ColorSchemeType | ILinearGradientProps>;
}

export const AboutCard: React.FC<AboutCardProps> = ({
  imageURL,
  title,
  description,
  bgColor,
}) => {
  // const navigation = useNavigation();

  return (
    <Box alignItems="center">
      <Pressable onPress={() => {}}>
        {({ isPressed }) => (
          <Box
            maxW="56"
            overflow="hidden"
            borderColor="coolGray.200"
            backgroundColor={bgColor}
            borderWidth="1"
            rounded="md"
            style={{
              transform: [
                {
                  scale: isPressed ? 0.96 : 1,
                },
              ],
            }}
            _dark={{
              borderColor: 'coolGray.600',
            }}
          >
            <View px="5" pt="5">
              <Image
                source={{
                  uri: imageURL,
                }}
                alt="image"
                height={'40'}
                width={'56'}
              />
            </View>
            <Stack p="4" space={3}>
              <Stack space={2}>
                <Text isTruncated style={globalStyle.headingStyle}>
                  {title}
                </Text>
              </Stack>
              <Text numberOfLines={2} ellipsizeMode="tail">
                {description}
              </Text>
            </Stack>
          </Box>
        )}
      </Pressable>
    </Box>
  );
};
