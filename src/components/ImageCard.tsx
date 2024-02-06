import React from 'react';
import { AspectRatio, Box, Center, Image, Pressable, Text } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import FontistoIcon from 'react-native-vector-icons/Fontisto';
import { globalStyle } from '../utils/globalStyles';
import {
  ColorSchemeType,
  ResponsiveValue,
} from 'native-base/lib/typescript/components/types';
import { ILinearGradientProps } from 'native-base/lib/typescript/components/primitives/Box/types';

export interface ImageCardProps {
  id: string;
  imageURL: string;
  title: string;
  shortDescription?: string;
  description: string;
  alt?: string;
  fileType?: string;
  file?: Record<string, any>;
  bgColor?: ResponsiveValue<ColorSchemeType | ILinearGradientProps>;
  isBookmarkVisible?: boolean;
  isFavorite?: boolean;
  locked?: boolean;
}

export const ImageCard: React.FC<ImageCardProps> = ({
  id,
  imageURL,
  title,
  shortDescription,
  description,
  bgColor,
  alt = 'image',
  file,
  fileType,
  isBookmarkVisible = true,
  isFavorite = false,
  locked,
}) => {
  const navigation = useNavigation();

  const handlePress = () => {
    if (!locked) {
      navigation.navigate('DetailsScreen', {
        id,
        name: title,
        imageURL,
        description,
        file,
        fileType,
      });
    }
  };
  return (
    <Pressable onPress={handlePress}>
      {({ isPressed }) => (
        <Box
          maxW="56"
          overflow="hidden"
          borderColor="coolGray.200"
          backgroundColor={bgColor}
          borderWidth="1"
          rounded="md"
          position="relative"
          style={{ transform: [{ scale: isPressed ? 0.96 : 1 }] }}
          _dark={{
            borderColor: 'coolGray.600',
          }}
        >
          <AspectRatio w="100%" ratio={7 / 8}>
            <Image
              source={{
                uri: imageURL,
              }}
              alt={alt}
            />
          </AspectRatio>
          <Box
            position="absolute"
            width="full"
            height="full"
            bottom="0"
            backgroundColor="black"
            opacity={0.5}
          />
          {isBookmarkVisible && (
            <Box position="absolute" top="-4" right="4">
              <Center>
                <FontistoIcon
                  name={isFavorite ? 'bookmark-alt' : 'bookmark'}
                  size={40}
                  color={isFavorite ? 'gold' : '#fff'}
                />
              </Center>
            </Box>
          )}
          <Center position="absolute" bottom="0" px="3" py="1.5">
            <Text
              isTruncated
              color="white"
              mb={2}
              style={globalStyle.headingStyle}
            >
              {title}
            </Text>
            <Text color="white" numberOfLines={2} ellipsizeMode="tail">
              {shortDescription ?? description}
            </Text>
          </Center>
          {locked && (
            <Box
              position="absolute"
              width="100%"
              height="100%"
              backgroundColor="grey"
              opacity={0.5}
            >
              <Center width="100%" height="100%">
                <FontistoIcon name="locked" size={40} color="#fff" />
              </Center>
            </Box>
          )}
        </Box>
      )}
    </Pressable>
  );
};
