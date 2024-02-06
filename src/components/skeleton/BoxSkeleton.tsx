import React from 'react';
import { AspectRatio, Box, Skeleton } from 'native-base';

export const BoxSkeleton = () => {
  return (
    <Box
      maxW="full"
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
      <AspectRatio w="100%" ratio={9 / 16}>
        <Skeleton height="full" />
      </AspectRatio>
    </Box>
  );
};
