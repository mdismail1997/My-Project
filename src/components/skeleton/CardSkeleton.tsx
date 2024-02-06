import React from 'react';
import { AspectRatio, Box, Skeleton } from 'native-base';

export const CardSkeleton = () => {
  return (
    <Box
      maxW="56"
      overflow="hidden"
      borderWidth="1"
      rounded="md"
      marginRight="2"
      _dark={{
        borderColor: 'coolGray.500',
      }}
      _light={{
        borderColor: 'coolGray.200',
      }}
    >
      <AspectRatio w="100%" ratio={2 / 1}>
        <Skeleton height="full" />
      </AspectRatio>
      <AspectRatio w="100%" ratio={2 / 1}>
        <Skeleton.Text p="4" />
      </AspectRatio>
    </Box>
  );
};
