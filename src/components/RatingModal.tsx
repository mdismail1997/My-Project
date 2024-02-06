import React, { useEffect, useState } from 'react';
import { View, Text, Stack, Center, Button } from 'native-base';
import Modal from 'react-native-modal';
import StarRating from 'react-native-star-rating';
import { useTheme } from '@react-navigation/native';
import { globalStyle } from '../utils/globalStyles';

interface RatingModalProps {
  isModalVisible: boolean;
  onClose?: () => void;
  onSubmit?: (ratings: number) => void;
}

export const RatingModal: React.FC<RatingModalProps> = ({
  isModalVisible,
  onClose,
  onSubmit,
}) => {
  const { colors } = useTheme();
  const [rating, setRating] = useState(0);

  useEffect(() => {
    if (isModalVisible === false) {
      setRating(0);
    }
  }, [isModalVisible]);

  return (
    <View>
      <Modal
        onBackdropPress={onClose}
        isVisible={isModalVisible}
        animationIn="zoomIn"
        animationOut="zoomOut"
      >
        <Stack
          padding="4"
          space="4"
          borderRadius="md"
          backgroundColor={colors.card}
        >
          <Stack space="2">
            <Center>
              <Text style={globalStyle.headingStyle}>Tap to Rating</Text>
            </Center>
            <Center>
              <Text sub>Tap a star to rate it</Text>
            </Center>
          </Stack>
          <Center>
            <StarRating
              selectedStar={(count) => {
                setRating(count);
              }}
              maxStars={5}
              rating={rating}
              starSize={26}
              fullStarColor="#FF8C00"
            />
          </Center>
          <Center>
            <Button
              colorScheme="blue"
              onPress={() => onSubmit?.(rating)}
              borderRadius={30}
              size="full"
              height={10}
              style={{ margin: 10 }}
            >
              SUBMIT
            </Button>
          </Center>
          <Center>
            <Text sub textAlign="center">
              1 star for Average, 2 stars for Ok, 3 stars for Good, 4 stars for
              Very good, 5 stars for excellent
            </Text>
          </Center>
        </Stack>
      </Modal>
    </View>
  );
};
