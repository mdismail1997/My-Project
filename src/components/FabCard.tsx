import React from 'react';
import {
  Box,
  Pressable,
  Stack,
  View,
  Image,
  Text,
  Spacer,
  HStack,
  IBoxProps,
} from 'native-base';
import { useNavigation } from '@react-navigation/native';
import StarRating from 'react-native-star-rating';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  ColorSchemeType,
  ResponsiveValue,
} from 'native-base/lib/typescript/components/types';
import { ILinearGradientProps } from 'native-base/lib/typescript/components/primitives/Box/types';

interface FabCard {
  id: string;
  imageURL: string;
  title: string;
  shortDescription?: string;
  description: string;
  alt?: string;
  fileType?: string;
  file?: Record<string, any>;
  bgColor?: ResponsiveValue<ColorSchemeType | ILinearGradientProps>;
  width?: IBoxProps['width'];
}

export const FabCard: React.FC<FabCard> = ({
  id,
  imageURL,
  description,
  title,
  bgColor,
  alt = 'image',
  shortDescription,
  file,
  fileType,
  width = '72',
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
            file,
            fileType,
          })
        }
      >
        {({ isPressed }) => (
          <Box
            width={width}
            borderWidth="1"
            borderColor="coolGray.300"
            backgroundColor={bgColor}
            rounded="md"
            overflow="hidden"
            style={{ transform: [{ scale: isPressed ? 0.96 : 1 }] }}
            _dark={{
              borderColor: 'coolGray.600',
            }}
          >
            <Stack direction={'row'} alignItems="center">
              <Image
                flex={1}
                source={{ uri: imageURL }}
                alt={alt}
                height="full"
                width="full"
              />
              <View m={2} flex={3} height="20">
                <HStack justifyContent="space-between">
                  <View flex={1}>
                    <Text bold isTruncated>
                      {title}
                    </Text>
                    <HStack>
                      <StarRating
                        disabled={true}
                        maxStars={5}
                        rating={5}
                        starSize={20}
                        fullStarColor="#FF8C00"
                      />
                    </HStack>
                  </View>
                  <Ionicons name="heart-circle" color="#FF8C00" size={26} />
                </HStack>
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
