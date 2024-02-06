import React, {useState} from 'react';
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  FlatList,
} from 'react-native';
import {Text, TextInput, Button, HelperText} from 'react-native-paper';
import CustomButton from '../../components/CustomButton';

import {COLORS, FONT_FAMILY} from '../../utils/Const';
import {DEVICE_WIDTH, hp, wp} from '../../utils/ResponsiveLayout';
export const Slider = props => {
  const isCarousel = React.useRef(null);

  const [sliderState, setSliderState] = useState({currentPage: 0});

  const imageSlider = [
    {
      id: 1,
      img: require('../../Assets/slider/slider1.png'),
      desc: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
    },
    {
      id: 2,
      img: require('../../Assets/slider/slider2.png'),
      desc: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
    },
    {
      id: 3,
      img: require('../../Assets/slider/slider3.png'),
      desc: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
    },
  ];

  const setSliderPage = event => {
    const {currentPage} = sliderState;
    const {x} = event.nativeEvent.contentOffset;
    const indexOfNextScreen = Math.ceil(x / DEVICE_WIDTH);
    if (indexOfNextScreen !== currentPage) {
      setSliderState({
        ...sliderState,
        currentPage: indexOfNextScreen,
      });
    }
  };

  const {currentPage: pageIndex} = sliderState;
  const pagination = () => {
    return (
      <View style={styles.indicatorContainer}>
        {imageSlider.map((e, i) => {
          return (
            <View
              key={i}
              style={[
                styles.indicator,
                {
                  width: pageIndex === i ? wp(24) : wp(16),
                  backgroundColor:
                    pageIndex === i ? COLORS.YELLOW_GREEN : COLORS.SILVER_SAND,
                },
              ]}
            />
          );
        })}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        onScroll={event => {
          setSliderPage(event);
        }}
        horizontal
        pagingEnabled
        scrollEventThrottle={16}>
        <View style={styles.sliderContainer}>
          <Image source={imageSlider[0].img} style={styles.imgStyle} />
          <Text style={styles.titleStyle}>How it works</Text>
          <Text style={styles.descStyle}>{imageSlider[0]?.desc}</Text>
          {pagination()}
        </View>
        <View style={styles.sliderContainer}>
          <Image source={imageSlider[1].img} style={styles.imgStyle} />
          <Text style={styles.titleStyle}>How it works</Text>
          <Text style={styles.descStyle}>{imageSlider[0]?.desc}</Text>
          {pagination()}
        </View>
        <View style={styles.sliderContainer}>
          <Image source={imageSlider[2].img} style={styles.imgStyle} />
          <Text style={styles.titleStyle}>How it works</Text>
          <Text style={styles.descStyle}>{imageSlider[0]?.desc}</Text>
          {pagination()}
        </View>
      </ScrollView>
      <CustomButton
        title="Skip"
        buttonStyle={{
          marginBottom: hp(24),
          marginHorizontal: wp(36),
        }}
        onPress={() => {
          props.navigation.navigate('Step');
        }}
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  imgStyle: {
    height: hp(284),
    width: DEVICE_WIDTH - 24,
    resizeMode: 'contain',
  },
  sliderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: DEVICE_WIDTH,
  },
  titleStyle: {
    fontSize: wp(24),
    fontFamily: FONT_FAMILY.LATO_BOLD,
    color: COLORS.YELLOW_GREEN,
    marginTop: hp(36),
  },
  descStyle: {
    fontSize: wp(14),
    fontFamily: FONT_FAMILY.LATO_REGULAR,
    color: COLORS.NICKEL,
    marginTop: hp(32),
    marginHorizontal: wp(16),
    textAlign: 'center',
    lineHeight: 19,
  },
  indicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
    marginTop: hp(36),
  },
  indicator: {
    height: hp(6),
    width: wp(16),
    borderRadius: 4,
    backgroundColor: COLORS.SILVER_SAND,
    marginHorizontal: 5,
  },
  head: {
    color: '#333333',
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 20,
    marginLeft: 30,
  },
  text: {
    color: '#737373',
    fontSize: 15,
    marginTop: 20,
    marginLeft: 30,
  },
  view: {
    flexDirection: 'row',
    margin: 15,
    marginTop: 60,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  verticleLine: {
    height: 2,
    width: '50%',
    backgroundColor: '#8FCD2D',
    marginLeft: 10,
    marginTop: 10,
    opacity: 0.3,
  },
});
