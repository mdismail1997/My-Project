import {FlatList, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import {
  calcH,
  calcW,
  fSize,
  IMAGE_PATH,
  STYLES,
} from '../../../utils/constants/common.js';
import {capitalizeFirstLetter} from '../../navigator/DrawerContent.js';
import {FONTS} from '../../../conts/theme.js';
import {AirbnbRating, Rating} from '@rneui/base';
import ReviewCard from '../../components/ReviewCard.js';
import COLORS from '../../../conts/colors.js';
import icons from '../../../conts/icons.js';

export const date = item => {
  const orderDate = item.split(' ')[0];
  const d = new Date(orderDate);
  const ye = new Intl.DateTimeFormat('en', {year: 'numeric'}).format(d);
  const mo = new Intl.DateTimeFormat('en', {month: 'short'}).format(d);
  const da = new Intl.DateTimeFormat('en', {day: '2-digit'}).format(d);
  return `${da} ${mo} ${ye}`;
};

const RatingScreen = ({navigation, route}) => {
  console.log('route', route);

  const renderReview = () => {
    return (
      <FlatList
        data={route?.params?.review}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<View />}
        ListFooterComponentStyle={{height: calcH(0.245)}}
      />
    );
  };

  const renderItem = ({item}) => {
    console.log('item', item);
    const value =
      item.ratings.reduce((acc, c) => acc + c.value, 0) / item.ratings.length;

    return (
      <View style={{flex: 1}}>
        <ReviewCard
          size={15}
          userName={`${item.nickname}`}
          productName={`${item.title}`}
          review={`${item.detail}`}
          date={`Review in ${date(item.created_at)}`}
          defaultRating={value}
          source={item?.avatar != null ? {uri: item?.avatar} : icons.user}
        />
      </View>
    );
  };

  const ratingCount = () => {
    let arr = [];
    let avgRating = [];
    const totalRating = route?.params?.review.length;
    const a = route?.params?.review.map((item, i) => {
      console.log('item', item);
      const arr2 = item.ratings.map(i => i?.value);
      const value =
        item.ratings.reduce((acc, c) => acc + c.value, 0) / item.ratings.length;
      console.log('value', value);
      avgRating.push(value);
    });
    console.log('avgRating', avgRating);
    const totalCount = avgRating.reduce((acc, c) => acc + c, 0);
    console.log('totalCount', totalCount);
    return totalCount / totalRating;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.subContainer}>
        <View style={{flexDirection: 'row'}}>
          <FastImage
            source={{
              uri: `${IMAGE_PATH.PRODUCT_PATH}${route?.params?.editimgs[0]}`,
            }}
            style={styles.leftImg}
          />
          <View style={{marginLeft: 10}}>
            <Text style={styles.name}>
              {capitalizeFirstLetter(route?.params?.name)}{' '}
            </Text>
            <Text style={styles.lastBottomtext}>
              {`OD#${route?.params?.productId}`}{' '}
            </Text>
          </View>
        </View>

        <View
          style={{
            alignItems: 'flex-start',
            marginTop: 10,
            left: -2,
          }}>
          <AirbnbRating
            isDisabled={true}
            count={5}
            reviews={['Terrible', 'Bad', 'Meh', 'OK', 'Good']}
            defaultRating={ratingCount()}
            size={20}
            showRating={false}
          />
          <View style={{flexDirection: 'row', marginBottom: 10}}>
            <Text style={{color: COLORS.Profile_font_color}}>
              Total {route?.params?.review.length} rating
            </Text>
            {route?.params?.review.length > 0 ? (
              <Text style={{marginLeft: 10, color: COLORS.Profile_font_color}}>
                {`${ratingCount().toFixed(1)} out of 5`}{' '}
              </Text>
            ) : (
              <Text style={{marginLeft: 10}}>{`0 out of 5`} </Text>
            )}
          </View>

          <View></View>
        </View>
        {route?.params?.review.length > 0 ? (
          renderReview()
        ) : (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              height: '85%',
            }}>
            <Text style={styles.noOrderText}>No Reviews yet...</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default RatingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subContainer: {
    marginHorizontal: calcW(0.04),
    marginVertical: calcH(0.02),
  },
  leftImg: {
    width: calcW(0.125),
    height: calcW(0.16),
    alignSelf: 'flex-start',
  },
  lastBottomtext: {
    fontSize: fSize(10),
    color: STYLES.ORDER_COLOR,
    ...FONTS.WorkSans_reg,
    paddingTop: calcH(0.002),
  },
  name: {fontSize: fSize(16), color: STYLES.HEADER_COLOR},
  noOrderText: {
    ...FONTS.Poppins_med,
    fontSize: fSize(18),
    color: COLORS.Profile_font_color,
  },
});
