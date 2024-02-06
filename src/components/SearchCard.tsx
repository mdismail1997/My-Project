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
} from 'native-base';
import { useNavigation } from '@react-navigation/native';
import StarRating from 'react-native-star-rating';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  ColorSchemeType,
  ResponsiveValue,
} from 'native-base/lib/typescript/components/types';
import { ILinearGradientProps } from 'native-base/lib/typescript/components/primitives/Box/types';

interface SearchCardProps {
  imageURL: string;
  title: string;
  description: string;
  bgColor?: ResponsiveValue<ColorSchemeType | ILinearGradientProps>;
}

export const SearchCard: React.FC<SearchCardProps> = ({
  imageURL,
  description,
  title,
  bgColor,
}) => {
  const navigation = useNavigation();

  return (
    <View>
      <Pressable
        onPress={() =>
          navigation.navigate('DetailsScreen', {
            id: '',
            name: title,
            imageURL,
            description,
          })
        }
      >
        {({ isPressed }) => (
          <Box
            width="full"
            borderWidth="1"
            borderColor="coolGray.300"
            backgroundColor={bgColor}
            style={{ transform: [{ scale: isPressed ? 0.96 : 1 }] }}
            _dark={{
              borderColor: 'coolGray.600',
            }}
          >
            <Stack direction={'row'} alignItems="center">
              <Image
                flex={1}
                source={{ uri: imageURL }}
                alt="card_image"
                height="full"
                width="full"
              />
              <View m={2} flex={3}>
                <HStack justifyContent="space-between">
                  <View flex={1}>
                    <Text bold isTruncated>
                      {title}
                    </Text>
                    <HStack space="2">
                      <StarRating
                        disabled={true}
                        maxStars={5}
                        rating={4}
                        starSize={20}
                        fullStarColor="#FF8C00"
                      />
                      <Text>4.0 - 75 reviews</Text>
                    </HStack>
                  </View>
                  <Ionicons name="heart-circle" color="#FF8C00" size={26} />
                </HStack>
                <Spacer />
                <Text fontSize={'xs'} numberOfLines={2} ellipsizeMode="tail">
                  {description}
                </Text>
              </View>
            </Stack>
          </Box>
        )}
      </Pressable>
    </View>
  );
};
