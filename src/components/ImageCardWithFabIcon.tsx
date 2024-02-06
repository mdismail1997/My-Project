import React from 'react';
import {
  AspectRatio,
  Box,
  Center,
  Image,
  Pressable,
  Text,
  View,
} from 'native-base';
import { useNavigation, useTheme } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { globalStyle } from '../utils/globalStyles';
import {
  ColorSchemeType,
  ResponsiveValue,
} from 'native-base/lib/typescript/components/types';
import { ILinearGradientProps } from 'native-base/lib/typescript/components/primitives/Box/types';

interface ImageCardWithFabIconProps {
  id?: string;
  imageURL: string;
  title: string;
  shortDescription?: string;
  description: string;
  alt?: string;
  fileType?: string;
  file?: Record<string, any>;
  bgColor?: ResponsiveValue<ColorSchemeType | ILinearGradientProps>;
}

export const ImageCardWithFabIcon: React.FC<ImageCardWithFabIconProps> = ({
  imageURL,
  title,
  shortDescription,
  description,
  alt = 'image',
  fileType = 'doc',
  file,
  bgColor,
}) => {
  const { colors } = useTheme();
  const navigation = useNavigation();

  return (
    <Pressable
      onPress={() =>
        navigation.navigate('DetailsScreen', {
          id: '',
          name: title,
          imageURL,
          description,
          fileType,
          file,
        })
      }
    >
      {({ isPressed }) => (
        <Box
          maxW="56"
          overflow="hidden"
          borderColor="coolGray.200"
          backgroundColor={bgColor}
          borderWidth="1"
          rounded="md"
          style={{ transform: [{ scale: isPressed ? 0.96 : 1 }] }}
          _dark={{
            borderColor: 'coolGray.600',
          }}
        >
          <Box position="relative" mb={2}>
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
              bottom={-20}
              right={2}
              rounded={'full'}
              backgroundColor={colors.border}
              padding="0.5"
            >
              <Center>
                <MaterialIcons name="heart-circle" color="#FF8C00" size={40} />
              </Center>
            </Box>
          </Box>
          <View m={2} marginTop={3}>
            <Text isTruncated mb={2} style={globalStyle.headingStyle}>
              {title}
            </Text>
            <Text numberOfLines={2} ellipsizeMode="tail" height="12">
              {shortDescription ?? ''}
            </Text>
          </View>
        </Box>
      )}
    </Pressable>
  );
};
