import React from 'react';
import { View, Box, Stack, Skeleton } from 'native-base';

export const FabCardSkeleton = () => {
  return (
    <Box
      width="72"
      borderWidth="1"
      borderColor="coolGray.300"
      rounded="md"
      overflow="hidden"
      marginRight="2"
      _dark={{
        borderColor: 'coolGray.600',
      }}
    >
      <Stack direction={'row'} alignItems="center" height="24">
        <Skeleton height="full" width="30%" />
        <View m={2} flex={3} height="full">
          <Skeleton.Text p="4" />
        </View>
      </Stack>
    </Box>
  );
};
