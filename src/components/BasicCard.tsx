import React from 'react';
import {
  AspectRatio,
  Box,
  HStack,
  Image,
  Pressable,
  Stack,
  Text,
  View,
} from 'native-base';
import { useNavigation, useTheme } from '@react-navigation/native';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import { globalStyle } from '../utils/globalStyles';
import {
  ColorSchemeType,
  ResponsiveValue,
} from 'native-base/lib/typescript/components/types';
import { ILinearGradientProps } from 'native-base/lib/typescript/components/primitives/Box/types';

interface BasicCardProps {
  id: string;
  imageURL: string;
  title: string;
  shortDescription?: string;
  description: string;
  alt?: string;
  ratings?: number;
  fileType?: string;
  file?: Record<string, any>;
  bgColor?: ResponsiveValue<ColorSchemeType | ILinearGradientProps>;
}

export const BasicCard: React.FC<BasicCardProps> = ({
  id,
  imageURL,
  title,
  shortDescription,
  description,
  alt = 'image',
  ratings = 0,
  fileType = 'doc',
  file,
  bgColor,
}) => {
  const { colors } = useTheme();
  const navigation = useNavigation();

  const generateIconName = (_fileType: string) => {
    const updatedFiletype = _fileType.toLowerCase();
    switch (updatedFiletype) {
      case 'doc':
        return 'doc';
      case 'audio':
        return 'microphone';
      case 'video':
        return 'camrecorder';
      case 'podcast':
        return 'music-tone';
      default:
        return 'doc';
    }
  };

  return (
    <Box alignItems="center">
      <Pressable
        onPress={() =>
          navigation.navigate('DetailsScreen', {
            id,
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
            rounded="md"
            borderWidth="1"
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
            <AspectRatio
              width="100%"
              backgroundColor="coolGray.400"
              ratio={7 / 4}
            >
              <Image
                source={{
                  uri: imageURL,
                }}
                alt={alt}
              />
            </AspectRatio>
            <Stack p="4" space={3}>
              <Stack space={2}>
                <Text isTruncated style={globalStyle.headingStyle}>
                  {title}
                </Text>
              </Stack>
              <Text numberOfLines={2} ellipsizeMode="tail" height="10">
                {shortDescription ?? description}
              </Text>
              <HStack
                alignItems="center"
                space={4}
                justifyContent="space-between"
              >
                <View flex={2}>
                  <SimpleLineIcons
                    name={generateIconName(fileType)}
                    size={20}
                    color={colors.text}
                  />
                </View>
                <View flex={1}>
                  <HStack justifyContent="space-between">
                    <Text>{ratings}</Text>
                    <EntypoIcons name="star" size={20} color={colors.text} />
                  </HStack>
                </View>
              </HStack>
            </Stack>
          </Box>
        )}
      </Pressable>
    </Box>
  );
};
