import React from 'react';
import {
  Center,
  Heading,
  Image,
  ScrollView,
  Spacer,
  Stack,
  Text,
} from 'native-base';
import { StyleSheet } from 'react-native';
import { assetImages } from '../utils/assets';

export const UnderDevelopment = () => {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      height="full"
      contentContainerStyle={styles.root}
    >
      <Stack space={2}>
        <Center>
          <Image source={assetImages.UnderDev} alt="image" height={260} />
        </Center>
        <Center>
          <Heading>We are on the way.</Heading>
          <Spacer />
          <Text>Please be patient!</Text>
        </Center>
      </Stack>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    flexGrow: 1,
    justifyContent: 'center',
    flexDirection: 'column',
  },
});
