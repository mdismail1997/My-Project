import React from 'react';
import { View, Text, Pressable, Box, Stack, Image, Spacer } from 'native-base';

interface BackgroundKnowledgeCardProps {
  id: string;
  imageURL: string;
  alt?: string;
  title: string;
  description: string;
}

export const BackgroundKnowledgeCard: React.FC<
  BackgroundKnowledgeCardProps
> = ({ imageURL, title, alt = 'image', description }) => {
  return (
    <View alignItems="center">
      <Pressable onPress={() => {}}>
        {({ isPressed }) => (
          <Box
            width="xs"
            borderWidth="1"
            borderColor="coolGray.300"
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
            <Stack direction={'row'} alignItems="center">
              <Image
                flex={2}
                source={{ uri: imageURL }}
                alt={alt}
                height="full"
                width="full"
              />
              <View p={2} flex={4}>
                <Text bold isTruncated>
                  {title}
                </Text>
                <Spacer />
                <Text
                  fontSize={'xs'}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                  flex={1}
                >
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
