import React from 'react';
import { Box, Stack, Image, Pressable, Text, View, Spacer } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import {
  ColorSchemeType,
  ResponsiveValue,
} from 'native-base/lib/typescript/components/types';
import { ILinearGradientProps } from 'native-base/lib/typescript/components/primitives/Box/types';

export interface CardRowProps {
  id: string;
  imageURL: string;
  title: string;
  shortDescription?: string;
  description: string;
  alt?: string;
  width?: string | number;
  height?: string | number;
  bgColor?: ResponsiveValue<ColorSchemeType | ILinearGradientProps>;
}

export const CardRow: React.FC<CardRowProps> = ({
  id,
  imageURL,
  title,
  description,
  shortDescription,
  alt = 'card_image',
  width = '72',
  height = 73,
  bgColor,
}) => {
  const navigation = useNavigation();

  return (
    <View alignItems="center">
      <Pressable
        onPress={() =>
          navigation.navigate('DetailsScreen', {
            id,
            name: title,
            imageURL,
            description,
          })
        }
      >
        {({ isPressed }) => (
          <Box
            width={width}
            height={height}
            borderWidth="1"
            borderColor="coolGray.300"
            backgroundColor={bgColor}
            rounded="md"
            overflow="hidden"
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
            <Stack direction={'row'} alignItems="center" flex={1}>
              <Image
                flex={2}
                source={{ uri: imageURL }}
                alt={alt}
                height="full"
                width="full"
                resizeMode="cover"
              />
              <View p={2} flex={3}>
                <Text bold isTruncated>
                  {title}
                </Text>
                <Spacer />
                <Text fontSize={'xs'} numberOfLines={2} ellipsizeMode="tail">
                  {shortDescription ?? description}
                </Text>
              </View>
            </Stack>
          </Box>
        )}
      </Pressable>
    </View>
  );
};
