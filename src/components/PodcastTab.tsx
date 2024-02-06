import React, { useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Heading, HStack, Text, VStack } from 'native-base';
import StarRating from 'react-native-star-rating';
import RenderHTML from 'react-native-render-html';
import { RatingModal } from './RatingModal';
import { SuccessfullySubmitModal } from './SuccessfullySubmitModal';
import { baseStyles, systemFonts, tagsStyles } from '../utils/globalStyles';

interface PodcastTabProps {
  title: string;
  description: string;
}

export const PodcastTab: React.FC<PodcastTabProps> = ({
  title,
  description,
}) => {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  return (
    <VStack key="podcast" space={4}>
      <RatingModal
        isModalVisible={isRatingModalOpen}
        onClose={() => {
          setIsRatingModalOpen(false);
        }}
        onSubmit={() => {
          setIsRatingModalOpen(false);
          setIsSuccessModalOpen(true);
        }}
      />
      <SuccessfullySubmitModal
        isModalVisible={isSuccessModalOpen}
        onClose={() => {
          setIsSuccessModalOpen(false);
        }}
      />
      <Heading>{title}</Heading>
      <HStack justifyContent="space-between">
        <HStack space={2}>
          <StarRating
            selectedStar={() => {
              setIsRatingModalOpen(true);
            }}
            maxStars={5}
            rating={4}
            starSize={20}
            fullStarColor="#FF8C00"
          />
          <Text color={colors.text[500]} fontSize="xs">
            4.0 - 75 reviews
          </Text>
        </HStack>
        <Text color={colors.text[500]} fontSize="xs">
          10 cotober, 2021
        </Text>
      </HStack>
      <RenderHTML
        contentWidth={width}
        source={{
          html: description,
        }}
        tagsStyles={tagsStyles(colors.text)}
        baseStyle={baseStyles}
        systemFonts={systemFonts}
      />
    </VStack>
  );
};
