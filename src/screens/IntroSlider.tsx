import React, { useEffect, useRef, useState } from 'react';
import { Dimensions } from 'react-native';
import {
  ScrollView,
  VStack,
  Text,
  Image,
  View,
  Box,
  Center,
  Button,
} from 'native-base';
import {
  StackActions,
  useNavigation,
  useTheme,
} from '@react-navigation/native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { globalStyle } from '../utils/globalStyles';

// # DUMMY DATA

const entries = [
  {
    title: 'Your digital coach for better riding',
    description:
      'Dear fellow riders - this app should help you to optimize the daily training with your horse if you train without a trainer.',
    image:
      'https://images.unsplash.com/photo-1609128231746-356e747a53bc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTZ8fGhvcnNlJTIwcmlkaW5nfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
  },
  {
    title: 'Your digital coach for better riding',
    description:
      'You tend to make the same (small) mistakes over and over again when riding... and it would be nice not to let them become a habit in the first place or to eradicate old patterns',
    image:
      'https://images.unsplash.com/photo-1513966366894-cfe5196c11c0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTV8fGhvcnNlJTIwcmlkaW5nfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
  },
  {
    title: 'Your digital coach for better riding',
    description:
      "However, that's not all that EquiPro - your digital coach for better riding will do for you!",
    image:
      'https://images.unsplash.com/photo-1622205656410-93adc26643e8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTN8fGhvcnNlJTIwcmlkaW5nfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
  },
];

// # END

const SLIDER_WIDTH = Dimensions.get('window').width;
const SLIDER_HIGHT = Dimensions.get('window').height;

export const IntroSlider = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const carouselRef = useRef<Carousel<{
    title: string;
    description: string;
    image: string;
  }> | null>(null);
  const [carouselData, setCarouselData] = useState<
    {
      title: string;
      description: string;
      image: string;
    }[]
  >([]);
  const [sliderActiveSlide, setSliderActiveSlide] = useState(0);

  useEffect(() => {
    setCarouselData(entries);
  }, []);

  return (
    <ScrollView>
      <VStack space={2}>
        <Box>
          <Carousel
            ref={(c) => (carouselRef.current = c)}
            data={carouselData}
            renderItem={({ item, index }) => {
              return (
                <View key={index}>
                  <Image
                    alt="img"
                    source={{ uri: item.image }}
                    width={SLIDER_WIDTH}
                    height={SLIDER_HIGHT / 2}
                  />
                </View>
              );
            }}
            sliderWidth={SLIDER_WIDTH}
            itemWidth={SLIDER_WIDTH}
            onSnapToItem={(index) => setSliderActiveSlide(index)}
          />
          <Pagination
            dotsLength={carouselData.length}
            activeDotIndex={sliderActiveSlide}
            inactiveDotOpacity={0.4}
            inactiveDotScale={0.6}
            // @ts-ignore
            carouselRef={carouselRef}
            tappableDots={!!carouselRef}
            dotStyle={{
              width: 40,
              backgroundColor: colors.primary,
              borderRadius: 0,
            }}
            containerStyle={{
              paddingHorizontal: 5,
              paddingVertical: 10,
              justifyContent: 'flex-start',
            }}
            dotContainerStyle={{ marginHorizontal: 0 }}
          />
        </Box>
        <VStack space={2} mx={2} height={SLIDER_HIGHT / 4}>
          <Text style={globalStyle.headingStyle}>
            {carouselData[sliderActiveSlide]?.title}
          </Text>
          <Text>{carouselData[sliderActiveSlide]?.description}</Text>
        </VStack>
        <Center>
          <Button
            colorScheme="coolGray"
            borderRadius={30}
            size="lg"
            px="20"
            onPress={() => {
              navigation.dispatch(StackActions.replace('LogIn'));
            }}
          >
            SKIP
          </Button>
        </Center>
      </VStack>
    </ScrollView>
  );
};
