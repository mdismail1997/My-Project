import React from 'react';
import { Box, HStack, Image, Text, Pressable } from 'native-base';
import { useTheme } from '@react-navigation/native';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import StarRating from 'react-native-star-rating';
import { TouchableOpacity } from 'react-native';

interface CustomListItemProps {
  imageURL: string;
  title: string;
  description: string;
  rating: number;
  noOfReviews: number;
}

export const CustomListItem: React.FC<CustomListItemProps> = ({
  imageURL,
  title,
  description,
  rating,
  noOfReviews,
}) => {
  const { colors } = useTheme();

  return (
    <Box maxW="full">
      <HStack space={2}>
        <Image
          source={{
            uri: imageURL,
          }}
          alt="image"
          height={'full'}
          width="20%"
        />
        <Pressable flex={1}>
          {({ isPressed }) => (
            <Box opacity={isPressed ? 0.68 : 1}>
              <Text isTruncated>{title}</Text>
              <HStack alignItems="center" space={1}>
                <StarRating
                  disabled={true}
                  maxStars={5}
                  rating={rating}
                  starSize={10}
                  fullStarColor="#FF8C00"
                />
                <Text>{`${rating.toFixed(1)} - ${noOfReviews} reviews`}</Text>
                <Box ml={4}>
                  <EntypoIcons name="heart" size={20} color="green" />
                </Box>
              </HStack>
              <Text numberOfLines={2} ellipsizeMode="tail">
                {description}
              </Text>
            </Box>
          )}
        </Pressable>
        <TouchableOpacity>
          <EntypoIcons
            name="dots-three-horizontal"
            size={26}
            color={colors.text}
          />
        </TouchableOpacity>
      </HStack>
    </Box>
  );
};
